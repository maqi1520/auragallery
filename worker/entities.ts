import { IndexedEntity } from "./core-utils";
import type { User, Photo } from "@shared/types";
// --- MOCK/SEED DATA ---
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alex', avatarUrl: 'https://i.pravatar.cc/150?u=alex' },
  { id: 'u2', name: 'Maria', avatarUrl: 'https://i.pravatar.cc/150?u=maria' },
  { id: 'u3', name: 'David', avatarUrl: 'https://i.pravatar.cc/150?u=david' },
];
const now = Date.now();
// Note: MOCK_PHOTOS are for seeding and won't be used with R2 uploads,
// but we update the structure for consistency.
export const MOCK_PHOTOS: Photo[] = [
    { id: crypto.randomUUID(), url: 'https://images.unsplash.com/photo-1716499248813-739b3ba4d82b?q=80&w=2574', r2_key: 'mock1.jpg', ownerId: 'u1', ownerName: 'Alex', ownerAvatarUrl: MOCK_USERS[0].avatarUrl, createdAt: now - 10000 },
    { id: crypto.randomUUID(), url: 'https://images.unsplash.com/photo-1715934491002-2a811a143c64?q=80&w=2574', r2_key: 'mock2.jpg', ownerId: 'u2', ownerName: 'Maria', ownerAvatarUrl: MOCK_USERS[1].avatarUrl, createdAt: now - 20000 },
    { id: crypto.randomUUID(), url: 'https://images.unsplash.com/photo-1716370432993-0855622d174e?q=80&w=2574', r2_key: 'mock3.jpg', ownerId: 'u1', ownerName: 'Alex', ownerAvatarUrl: MOCK_USERS[0].avatarUrl, createdAt: now - 30000 },
];
// --- ENTITIES ---
// USER ENTITY: one DO instance per user
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "" };
  static seedData = MOCK_USERS;
}
// PHOTO ENTITY: one DO instance per photo
export class PhotoEntity extends IndexedEntity<Photo> {
  static readonly entityName = "photo";
  static readonly indexName = "photos";
  static readonly initialState: Photo = { id: "", url: "", r2_key: "", ownerId: "", ownerName: "", createdAt: 0 };
  // We no longer seed photos as they should be uploaded to R2.
  // static seedData = MOCK_PHOTOS;
}