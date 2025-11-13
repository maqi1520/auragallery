import { create } from 'zustand';
import type { Photo } from '@shared/types';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
interface PhotoState {
  photos: Photo[];
  isLoading: boolean;
  error: string | null;
  fetchPhotos: () => Promise<void>;
  addPhoto: (file: File, ownerId: string) => Promise<Photo | null>;
  deletePhoto: (photoId: string, ownerId: string) => Promise<void>;
}
export const usePhotoStore = create<PhotoState>((set, get) => ({
  photos: [],
  isLoading: false,
  error: null,
  fetchPhotos: async () => {
    set({ isLoading: true, error: null });
    try {
      const photos = await api<Photo[]>('/api/photos');
      set({ photos, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch photos';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },
  addPhoto: async (file: File, ownerId: string) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('ownerId', ownerId);
      const newPhoto = await api<Photo>('/api/photos', {
        method: 'POST',
        body: formData,
      });
      set((state) => ({
        photos: [newPhoto, ...state.photos],
      }));
      toast.success('Photo uploaded successfully!');
      return newPhoto;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add photo';
      toast.error(errorMessage);
      return null;
    }
  },
  deletePhoto: async (photoId: string, ownerId: string) => {
    try {
      await api(`/api/photos/${photoId}`, {
        method: 'DELETE',
        headers: { 'X-User-Id': ownerId },
      });
      set((state) => ({
        photos: state.photos.filter((p) => p.id !== photoId),
      }));
      toast.success('Photo deleted successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete photo';
      toast.error(errorMessage);
    }
  },
}));