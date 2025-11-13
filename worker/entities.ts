import { IndexedEntity } from "./core-utils";
import type { User, Photo } from "@shared/types";
// --- MOCK/SEED DATA ---
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alex', avatarUrl: 'https://i.pravatar.cc/150?u=alex' },
  { id: 'u2', name: 'Maria', avatarUrl: 'https://i.pravatar.cc/150?u=maria' },
  { id: 'u3', name: 'David', avatarUrl: 'https://i.pravatar.cc/150?u=david' },
];
const now = Date.now();
export const MOCK_PHOTOS: Photo[] = [
    { id: crypto.randomUUID(), url: 'https://images.unsplash.com/photo-1716499248813-739b3ba4d82b?q=80&w=2574', ownerId: 'u1', ownerName: 'Alex', ownerAvatarUrl: MOCK_USERS[0].avatarUrl, createdAt: now - 10000 },
    { id: crypto.randomUUID(), url: 'https://images.unsplash.com/photo-1715934491002-2a811a143c64?q=80&w=2574', ownerId: 'u2', ownerName: 'Maria', ownerAvatarUrl: MOCK_USERS[1].avatarUrl, createdAt: now - 20000 },
    { id: crypto.randomUUID(), url: 'https://images.unsplash.com/photo-1716370432993-0855622d174e?q=80&w=2574', ownerId: 'u1', ownerName: 'Alex', ownerAvatarUrl: MOCK_USERS[0].avatarUrl, createdAt: now - 30000 },
    { id: crypto.randomUUID(), url: 'https://images.unsplash.com/photo-1716236939307-b35a77a6411b?q=80&w=2574', ownerId: 'u3', ownerName: 'David', ownerAvatarUrl: MOCK_USERS[2].avatarUrl, createdAt: now - 40000 },
    { id: crypto.randomUUID(), url: 'https://images.unsplash.com/photo-1716134934469-a1a7c35d512e?q=80&w=2574', ownerId: 'u2', ownerName: 'Maria', ownerAvatarUrl: MOCK_USERS[1].avatarUrl, createdAt: now - 50000 },
    { id: crypto.randomUUID(), url: 'https://images.unsplash.com/photo-1715934490983-91c39a6f0394?q=80&w=2574', ownerId: 'u1', ownerName: 'Alex', ownerAvatarUrl: MOCK_USERS[0].avatarUrl, createdAt: now - 60000 },
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
  static readonly initialState: Photo = { id: "", url: "", ownerId: "", ownerName: "", createdAt: 0 };
  static seedData = MOCK_PHOTOS;
}