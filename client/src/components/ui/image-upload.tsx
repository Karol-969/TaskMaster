import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (imageUrl: string) => void;
  placeholder?: string;
  className?: string;
}

export function ImageUpload({ label, value, onChange, placeholder, className }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, GIF, or WebP image.",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      onChange(result.imageUrl);
      
      toast({
        title: "Image uploaded",
        description: "Your image has been successfully uploaded.",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    onChange('');
  };

  return (
    <div className={className}>
      <Label className="text-sm font-medium">{label}</Label>
      
      {/* Mode Toggle */}
      <div className="flex space-x-2 mt-2 mb-3">
        <Button
          type="button"
          variant={uploadMode === 'url' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setUploadMode('url')}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          URL
        </Button>
        <Button
          type="button"
          variant={uploadMode === 'file' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setUploadMode('file')}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload
        </Button>
      </div>

      {uploadMode === 'url' ? (
        /* URL Input Mode */
        <div className="space-y-3">
          <Input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "Enter image URL"}
          />
        </div>
      ) : (
        /* File Upload Mode */
        <div className="space-y-3">
          <div 
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
            onClick={triggerFileInput}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <div className="flex flex-col items-center space-y-2">
              <ImageIcon className="w-8 h-8 text-gray-400" />
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {uploading ? 'Uploading...' : 'Click to upload image'}
              </div>
              <div className="text-xs text-gray-500">
                JPEG, PNG, GIF, WebP up to 5MB
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview and Clear */}
      {value && (
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <div className="flex items-center space-x-2">
              <ImageIcon className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                {value.length > 50 ? `${value.substring(0, 50)}...` : value}
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearImage}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Image Preview */}
          <div className="relative w-full h-32 rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiAxNkM5Ljc5IDEyIDcuNTcgMTIgNiAxMkMzIDEyIDMgMTUgMyAxNUMzIDE1IDMgMTggNiAxOEM4LjU3IDE4IDEyIDE4IDEyIDE2WiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTIgOEM5LjMgOCA5LjMgNi42IDkuMyA2LjZDOS4zIDYuNiA5LjMgNSAxMiA1QzE0LjcgNSAxNC43IDYuNiAxNC43IDYuNkMxNC43IDYuNiAxNC43IDggMTIgOFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}