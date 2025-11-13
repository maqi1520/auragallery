export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface User {
  id: string;
  name: string;
  avatarUrl?: string; // For a more realistic mock
}
export interface Photo {
  id: string;
  url: string;
  r2_key?: string;
  ownerId: string;
  ownerName: string;
  ownerAvatarUrl?: string;
  createdAt: number; // epoch millis
}
// Below are unused template types, kept for compatibility if needed elsewhere.
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number; // epoch millis
}