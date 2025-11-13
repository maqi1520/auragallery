import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Header } from '@/components/Header';
import { PhotoCard } from '@/components/PhotoCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/store/authStore';
import { usePhotoStore } from '@/store/photoStore';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
function PhotoGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="aspect-[4/3] w-full rounded-lg" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
function HeroSection() {
  return (
    <div className="text-center py-16 md:py-24 lg:py-32 bg-muted/30 rounded-xl">
      <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
        Welcome to AuraGallery
      </h2>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
        A minimalist space to share your moments. Log in to start uploading.
      </p>
      <div className="mt-8">
        <p className="text-sm text-muted-foreground">
          Please use the "Login As" button in the header to begin.
        </p>
      </div>
    </div>
  );
}
function EmptyState() {
    return (
      <div className="text-center py-16 md:py-24 lg:py-32 bg-muted/30 rounded-xl">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">
          The Gallery is Empty
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Be the first to upload a photo and start the collection!
        </p>
      </div>
    );
  }
export function HomePage() {
  const initAuth = useAuthStore((s) => s.init);
  const currentUser = useAuthStore((s) => s.currentUser);
  const fetchPhotos = usePhotoStore((s) => s.fetchPhotos);
  const photos = usePhotoStore((s) => s.photos);
  const isLoading = usePhotoStore((s) => s.isLoading);
  useEffect(() => {
    initAuth();
    fetchPhotos();
  }, [initAuth, fetchPhotos]);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-12 md:py-16">
            {!currentUser ? (
              <HeroSection />
            ) : (
              <>
                {isLoading ? (
                  <PhotoGridSkeleton />
                ) : photos.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    <AnimatePresence>
                      {photos.map((photo) => (
                        <PhotoCard key={photo.id} photo={photo} />
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <EmptyState />
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <footer className="py-8 text-center text-muted-foreground text-sm">
        <p>Built with ��️ at Cloudflare</p>
      </footer>
      <Toaster richColors position="top-right" />
    </div>
  );
}