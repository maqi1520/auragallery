import { Hono } from "hono";
import type { Env } from './core-utils';
import { ok, bad, notFound, isStr } from './core-utils';
import * as db from './db';
import type { Photo } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  let dbInitialized = false;
  app.use('/api/*', async (c, next) => {
    if (!dbInitialized) {
      await db.setupDb(c.env.DB);
      dbInitialized = true;
    }
    await next();
  });
  // --- USERS API (for mock login) ---
  app.get('/api/users', async (c) => {
    const users = await db.getUsers(c.env.DB);
    return ok(c, users);
  });
  // --- PHOTOS API ---
  app.get('/api/photos', async (c) => {
    const photos = await db.getPhotos(c.env.DB);
    return ok(c, photos);
  });
  app.post('/api/photos', async (c) => {
    const formData = await c.req.formData();
    const file = formData.get('file');
    const ownerId = formData.get('ownerId');
    if (!(file instanceof File) || !isStr(ownerId)) {
      return bad(c, 'A file and ownerId are required');
    }
    const owner = await db.getUserById(c.env.DB, ownerId);
    if (!owner) {
      return notFound(c, 'Owner user not found');
    }
    const r2Key = `${crypto.randomUUID()}-${file.name}`;
    await c.env.R2_BUCKET.put(r2Key, file.stream(), {
      httpMetadata: { contentType: file.type },
    });
    const newPhoto: Photo = {
      id: crypto.randomUUID(),
      url: `/api/assets/${r2Key}`,
      r2_key: r2Key,
      ownerId: owner.id,
      ownerName: owner.name,
      ownerAvatarUrl: owner.avatarUrl,
      createdAt: Date.now(),
    };
    await db.createPhoto(c.env.DB, newPhoto);
    return ok(c, newPhoto);
  });
  app.delete('/api/photos/:id', async (c) => {
    const photoId = c.req.param('id');
    const userId = c.req.header('X-User-Id');
    if (!isStr(userId)) {
      return bad(c, 'X-User-Id header is required for authorization', 401);
    }
    const photo = await db.getPhotoById(c.env.DB, photoId);
    if (!photo) {
      return notFound(c, 'Photo not found');
    }
    if (photo.ownerId !== userId) {
      return bad(c, 'You are not authorized to delete this photo', 403);
    }
    if (photo.r2_key) {
      await c.env.R2_BUCKET.delete(photo.r2_key);
    }
    const deleted = await db.deletePhoto(c.env.DB, photoId);
    return ok(c, { id: photoId, deleted });
  });
  // --- ASSET SERVING ---
  app.get('/api/assets/:key', async (c) => {
    const key = c.req.param('key');
    const object = await c.env.R2_BUCKET.get(key);
    if (object === null) {
      return notFound(c, 'Object Not Found');
    }
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('cache-control', 'public, max-age=31536000, immutable');
    return new Response(object.body, {
      headers,
    });
  });
}