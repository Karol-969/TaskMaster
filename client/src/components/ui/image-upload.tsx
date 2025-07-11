import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { uploadImage, uploadMultipleImages, createPreviewUrl, validateImageFile, cleanupPreviewUrl, getImageUrl } from '@/lib/image-upload';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
  currentImage?: string;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function ImageUpload({ 
  onImageUploaded, 
  currentImage, 
  label = "Upload Image",
  placeholder = "No image selected",
  className = ""
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast({
        title: "Invalid File",
        description: validation.error,
        variant: "destructive"
      });
      return;
    }

    // Create preview
    const preview = createPreviewUrl(file);
    setPreviewUrl(preview);

    try {
      setIsUploading(true);
      const response = await uploadImage(file);
      onImageUploaded(response.imageUrl);
      
      toast({
        title: "Image Uploaded",
        description: "Image uploaded successfully"
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive"
      });
      // Clean up preview on error
      cleanupPreviewUrl(preview);
      setPreviewUrl('');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    if (previewUrl) {
      cleanupPreviewUrl(previewUrl);
      setPreviewUrl('');
    }
    onImageUploaded('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayImageUrl = previewUrl || getImageUrl(currentImage);
  const hasImage = previewUrl || currentImage;

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium">{label}</label>
      
      <div className="space-y-4">
        {/* File Input */}
        <div className="flex items-center gap-4">
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isUploading}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="min-w-fit"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Choose File'}
          </Button>
        </div>

        {/* Image Preview */}
        {hasImage && (
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
                <img
                  src={displayImageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Image Preview</p>
                <p className="text-xs text-gray-500">
                  {isUploading ? 'Uploading...' : 'Ready to use'}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemoveImage}
                disabled={isUploading}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}

        {!hasImage && (
          <Card className="p-8 text-center border-dashed">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-500">{placeholder}</p>
          </Card>
        )}
      </div>
    </div>
  );
}

interface MultipleImageUploadProps {
  onImagesUploaded: (imageUrls: string[]) => void;
  currentImages?: string[];
  label?: string;
  maxImages?: number;
  className?: string;
}

export function MultipleImageUpload({
  onImagesUploaded,
  currentImages = [],
  label = "Upload Images",
  maxImages = 10,
  className = ""
}: MultipleImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const currentTotal = currentImages.length + previewUrls.length;
    if (currentTotal + files.length > maxImages) {
      toast({
        title: "Too Many Images",
        description: `Maximum ${maxImages} images allowed`,
        variant: "destructive"
      });
      return;
    }

    // Validate files
    for (const file of files) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        toast({
          title: "Invalid File",
          description: `${file.name}: ${validation.error}`,
          variant: "destructive"
        });
        return;
      }
    }

    // Create previews
    const previews = files.map(createPreviewUrl);
    setPreviewUrls(prev => [...prev, ...previews]);

    try {
      setIsUploading(true);
      const response = await uploadMultipleImages(files);
      onImagesUploaded([...currentImages, ...response.imageUrls]);
      
      // Clean up previews
      previews.forEach(cleanupPreviewUrl);
      setPreviewUrls([]);
      
      toast({
        title: "Images Uploaded",
        description: `${files.length} images uploaded successfully`
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload images",
        variant: "destructive"
      });
      // Clean up previews on error
      previews.forEach(cleanupPreviewUrl);
      setPreviewUrls([]);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (index: number, isPreview: boolean) => {
    if (isPreview) {
      const urlToCleanup = previewUrls[index];
      if (urlToCleanup) cleanupPreviewUrl(urlToCleanup);
      setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    } else {
      const newImages = currentImages.filter((_, i) => i !== index);
      onImagesUploaded(newImages);
    }
  };

  const allImages = [...currentImages, ...previewUrls];
  const canAddMore = allImages.length < maxImages;

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium">{label}</label>
      
      <div className="space-y-4">
        {/* File Input */}
        {canAddMore && (
          <div className="flex items-center gap-4">
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              disabled={isUploading}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="min-w-fit"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? 'Uploading...' : 'Add Images'}
            </Button>
          </div>
        )}

        {/* Images Grid */}
        {allImages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentImages.map((imageUrl, index) => (
              <Card key={`current-${index}`} className="p-2">
                <div className="relative aspect-square rounded-lg overflow-hidden">
                  <img
                    src={getImageUrl(imageUrl)}
                    alt={`Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveImage(index, false)}
                    className="absolute top-1 right-1 p-1 h-auto w-auto bg-black/50 text-white hover:bg-black/70"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </Card>
            ))}
            {previewUrls.map((previewUrl, index) => (
              <Card key={`preview-${index}`} className="p-2">
                <div className="relative aspect-square rounded-lg overflow-hidden">
                  <img
                    src={previewUrl}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveImage(index, true)}
                    disabled={isUploading}
                    className="absolute top-1 right-1 p-1 h-auto w-auto bg-black/50 text-white hover:bg-black/70"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {allImages.length === 0 && (
          <Card className="p-8 text-center border-dashed">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-500">No images selected</p>
            <p className="text-xs text-gray-400">Maximum {maxImages} images</p>
          </Card>
        )}

        {!canAddMore && (
          <p className="text-sm text-gray-500">
            Maximum number of images reached ({maxImages})
          </p>
        )}
      </div>
    </div>
  );
}