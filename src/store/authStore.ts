import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@shared/types';
import { api } from '@/lib/api-client';
interface AuthState {
  currentUser: User | null;
  users: User[];
  isInitialized: boolean;
  init: () => Promise<void>;
  login: (userId: string) => void;
  logout: () => void;
}
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [],
      isInitialized: false,
      init: async () => {
        if (get().isInitialized) return;
        try {
          const users = await api<User[]>('/api/users');
          set({ users, isInitialized: true });
          // Re-hydrate user from ID if it exists in the fresh user list
          const storedUser = get().currentUser;
          if (storedUser && !users.find(u => u.id === storedUser.id)) {
             set({ currentUser: null });
          } else if (storedUser) {
            const fullUser = users.find(u => u.id === storedUser.id);
            if (fullUser) set({ currentUser: fullUser });
          }
        } catch (error) {
          console.error("Failed to initialize auth store:", error);
          set({ isInitialized: true }); // Mark as initialized even on error to prevent retries
        }
      },
      login: (userId: string) => {
        const user = get().users.find((u) => u.id === userId);
        if (user) {
          set({ currentUser: user });
        }
      },
      logout: () => {
        set({ currentUser: null });
      },
    }),
    {
      name: 'auragallery-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ currentUser: state.currentUser ? { id: state.currentUser.id } : null } as Partial<AuthState>),
    }
  )
);