import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, PhotoEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import type { Photo, User } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // Ensure seed data is present on first load
  app.use('/api/*', async (c, next) => {
    await UserEntity.ensureSeed(c.env);
    await PhotoEntity.ensureSeed(c.env);
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
    // Sort by creation date, newest first
    const sortedPhotos = page.items.sort((a, b) => b.createdAt - a.createdAt);
    return ok(c, sortedPhotos);
  });
  app.post('/api/photos', async (c) => {
    const { url, ownerId } = (await c.req.json()) as { url?: string; ownerId?: string };
    if (!isStr(url) || !isStr(ownerId)) {
      return bad(c, 'url and ownerId are required');
    }
    const userEntity = new UserEntity(c.env, ownerId);
    if (!(await userEntity.exists())) {
      return notFound(c, 'Owner user not found');
    }
    const owner = await userEntity.getState();
    const newPhoto: Photo = {
      id: crypto.randomUUID(),
      url,
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
    const userId = c.req.header('X-User-Id'); // Mock authentication header
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
    const deleted = await PhotoEntity.delete(c.env, photoId);
    return ok(c, { id: photoId, deleted });
  });
}