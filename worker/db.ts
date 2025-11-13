import type { D1Database } from '@cloudflare/workers-types';
import type { Photo, User } from '@shared/types';
const MOCK_USERS: Omit<User, 'avatarUrl'>[] = [
  { id: 'user-1', name: 'Alice' },
  { id: 'user-2', name: 'Bob' },
  { id: 'user-3', name: 'Charlie' },
];
export async function setupDb(db: D1Database) {
  const batch = [
    db.prepare(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        avatarUrl TEXT
      );
    `),
    db.prepare(`
      CREATE TABLE IF NOT EXISTS photos (
        id TEXT PRIMARY KEY,
        url TEXT NOT NULL,
        r2_key TEXT,
        ownerId TEXT NOT NULL,
        ownerName TEXT NOT NULL,
        ownerAvatarUrl TEXT,
        createdAt INTEGER NOT NULL,
        FOREIGN KEY (ownerId) REFERENCES users(id)
      );
    `),
  ];
  await db.batch(batch);
  const { count } = (await db.prepare('SELECT COUNT(*) as count FROM users').first<{ count: number }>())!;
  if (count === 0) {
    const insertUsersStmt = db.prepare('INSERT INTO users (id, name, avatarUrl) VALUES (?, ?, ?)');
    const usersToInsert = MOCK_USERS.map(user =>
      insertUsersStmt.bind(user.id, user.name, `https://i.pravatar.cc/150?u=${user.id}`)
    );
    await db.batch(usersToInsert);
  }
}
export async function getUsers(db: D1Database): Promise<User[]> {
  const { results } = await db.prepare('SELECT * FROM users').all<User>();
  return results;
}
export async function getUserById(db: D1Database, id: string): Promise<User | null> {
  return await db.prepare('SELECT * FROM users WHERE id = ?').bind(id).first<User>();
}
export async function getPhotos(db: D1Database): Promise<Photo[]> {
  const { results } = await db.prepare('SELECT * FROM photos ORDER BY createdAt DESC').all<Photo>();
  return results;
}
export async function getPhotoById(db: D1Database, id: string): Promise<Photo | null> {
  return await db.prepare('SELECT * FROM photos WHERE id = ?').bind(id).first<Photo>();
}
export async function createPhoto(db: D1Database, photo: Photo): Promise<Photo> {
  await db.prepare(
    'INSERT INTO photos (id, url, r2_key, ownerId, ownerName, ownerAvatarUrl, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(
    photo.id,
    photo.url,
    photo.r2_key ?? null,
    photo.ownerId,
    photo.ownerName,
    photo.ownerAvatarUrl ?? null,
    photo.createdAt
  ).run();
  return photo;
}
export async function deletePhoto(db: D1Database, id: string): Promise<boolean> {
  const { success } = await db.prepare('DELETE FROM photos WHERE id = ?').bind(id).run();
  return success;
}