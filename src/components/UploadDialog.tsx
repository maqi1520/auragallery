import { useState, ChangeEvent } from 'react';
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
import { ImagePlus, Loader2, FileCheck2 } from 'lucide-react';
interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export function UploadDialog({ open, onOpenChange }: UploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setUploading] = useState(false);
  const addPhoto = usePhotoStore((s) => s.addPhoto);
  const currentUser = useAuthStore((s) => s.currentUser);
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size must be less than 10MB.');
        return;
      }
      if (!['image/jpeg', 'image/png'].includes(selectedFile.type)) {
        toast.error('Only JPEG and PNG files are allowed.');
        return;
      }
      setFile(selectedFile);
    }
  };
  const handleSubmit = async () => {
    if (!file || !currentUser) {
      toast.error('Please select a file to upload.');
      return;
    }
    setUploading(true);
    const newPhoto = await addPhoto(file, currentUser.id);
    setUploading(false);
    if (newPhoto) {
      setFile(null);
      onOpenChange(false);
    }
  };
  // Reset state when dialog is closed
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setFile(null);
      setUploading(false);
    }
    onOpenChange(isOpen);
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload a Photo</DialogTitle>
          <DialogDescription>
            Select a JPEG or PNG image from your device (max 10MB).
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="picture">Picture</Label>
            <Input id="picture" type="file" accept="image/jpeg, image/png" onChange={handleFileChange} />
          </div>
          {file && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 bg-muted rounded-md">
              <FileCheck2 className="h-4 w-4 text-green-500" />
              <span>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={isUploading || !file}>
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