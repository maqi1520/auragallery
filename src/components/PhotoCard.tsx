import { Photo } from '@shared/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/authStore';
import { usePhotoStore } from '@/store/photoStore';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';
interface PhotoCardProps {
  photo: Photo;
}
export function PhotoCard({ photo }: PhotoCardProps) {
  const currentUser = useAuthStore((s) => s.currentUser);
  const deletePhoto = usePhotoStore((s) => s.deletePhoto);
  const isOwner = currentUser?.id === photo.ownerId;
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }
  const handleDelete = () => {
    if (isOwner) {
      deletePhoto(photo.id, currentUser.id);
    }
  };
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden group relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <CardContent className="p-0">
          <div className="aspect-[4/3] bg-muted overflow-hidden">
            <img
              src={photo.url}
              alt={`Photo by ${photo.ownerName}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        </CardContent>
        <CardFooter className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={photo.ownerAvatarUrl} alt={photo.ownerName} />
              <AvatarFallback>{getInitials(photo.ownerName)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-foreground">{photo.ownerName}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(photo.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        </CardFooter>
        {isOwner && (
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon" className="h-9 w-9 rounded-full">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the photo from the gallery.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </Card>
    </motion.div>
  );
}