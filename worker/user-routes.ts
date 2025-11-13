import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, PhotoEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import type { Photo } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // Ensure seed data is present on first load
  app.use('/api/*', async (c, next) => {
    await UserEntity.ensureSeed(c.env);
    // We don't seed photos anymore as they will be uploaded to R2
    // await PhotoEntity.ensureSeed(c.env);
    await next();
  });
  // --- USERS API (for mock login) ---
  app.get('/api/users', async (c) => {
    const page = await UserEntity.list(c.env);
    return ok(c, page.items);
  });
  // --- PHOTOS API ---
  app.get('/api/photos', async (c) => {
    const page = await PhotoEntity.list(c.env);
    const sortedPhotos = page.items.sort((a, b) => b.createdAt - a.createdAt);
    return ok(c, sortedPhotos);
  });
  app.post('/api/photos', async (c) => {
    const formData = await c.req.formData();
    const file = formData.get('file');
    const ownerId = formData.get('ownerId');
    if (!(file instanceof File) || !isStr(ownerId)) {
      return bad(c, 'A file and ownerId are required');
    }
    const userEntity = new UserEntity(c.env, ownerId);
    if (!(await userEntity.exists())) {
      return notFound(c, 'Owner user not found');
    }
    const owner = await userEntity.getState();
    const r2Key = `${crypto.randomUUID()}-${file.name}`;
    await c.env.R2_BUCKET.put(r2Key, file.stream(), {
      httpMetadata: { contentType: file.type },
    });
    const newPhoto: Photo = {
      id: crypto.randomUUID(),
      url: `/api/assets/${r2Key}`, // URL to our asset server
      r2_key: r2Key,
      ownerId: owner.id,
      ownerName: owner.name,
      ownerAvatarUrl: owner.avatarUrl,
      createdAt: Date.now(),
    };
    await PhotoEntity.create(c.env, newPhoto);
    return ok(c, newPhoto);
  });
  app.delete('/api/photos/:id', async (c) => {
    const photoId = c.req.param('id');
    const userId = c.req.header('X-User-Id');
    if (!isStr(userId)) {
      return bad(c, 'X-User-Id header is required for authorization', 401);
    }
    const photoEntity = new PhotoEntity(c.env, photoId);
    if (!(await photoEntity.exists())) {
      return notFound(c, 'Photo not found');
    }
    const photo = await photoEntity.getState();
    if (photo.ownerId !== userId) {
      return bad(c, 'You are not authorized to delete this photo', 403);
    }
    // Delete from R2 if key exists
    if (photo.r2_key) {
      await c.env.R2_BUCKET.delete(photo.r2_key);
    }
    const deleted = await PhotoEntity.delete(c.env, photoId);
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