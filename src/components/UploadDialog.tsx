import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePhotoStore } from '@/store/photoStore';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { ImagePlus, Loader2 } from 'lucide-react';
interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export function UploadDialog({ open, onOpenChange }: UploadDialogProps) {
  const [url, setUrl] = useState('');
  const [isUploading, setUploading] = useState(false);
  const addPhoto = usePhotoStore((s) => s.addPhoto);
  const currentUser = useAuthStore((s) => s.currentUser);
  const handleSubmit = async () => {
    if (!url.trim() || !currentUser) {
      toast.error('Image URL is required.');
      return;
    }
    // Basic URL validation
    try {
      new URL(url);
    } catch (_) {
      toast.error('Please enter a valid image URL.');
      return;
    }
    setUploading(true);
    const newPhoto = await addPhoto(url, currentUser.id);
    setUploading(false);
    if (newPhoto) {
      setUrl('');
      onOpenChange(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload a Photo</DialogTitle>
          <DialogDescription>
            Paste a direct link to an image (JPEG/PNG) to add it to the gallery.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right">
              Image URL
            </Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="col-span-3"
              placeholder="https://..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <ImagePlus className="mr-2 h-4 w-4" />
                Add to Gallery
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}