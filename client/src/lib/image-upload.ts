/**
 * Image upload utilities for the admin panel and frontend
 * Ensures images work both in Replit and when downloaded locally
 */

export interface UploadResponse {
  message: string;
  imageUrl: string;
  fileName: string;
}

export interface MultipleUploadResponse {
  message: string;
  imageUrls: string[];
  fileNames: string[];
}

/**
 * Upload a single image file
 */
export async function uploadImage(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to upload image');
  }

  return response.json();
}

/**
 * Upload multiple image files
 */
export async function uploadMultipleImages(files: File[]): Promise<MultipleUploadResponse> {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('images', file);
  });

  const response = await fetch('/api/upload-multiple', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to upload images');
  }

  return response.json();
}

/**
 * Create a preview URL for a file (before upload)
 */
export function createPreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size too large. Maximum size is 5MB.'
    };
  }

  return { valid: true };
}

/**
 * Get image URL for display (handles both uploaded and placeholder images)
 */
export function getImageUrl(imageUrl: string | null | undefined, fallback: string = '/placeholder-image.png'): string {
  if (!imageUrl) return fallback;
  
  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http') || imageUrl.startsWith('https')) {
    return imageUrl;
  }
  
  // If it starts with /uploads, it's our uploaded image
  if (imageUrl.startsWith('/uploads/')) {
    return imageUrl;
  }
  
  // If it's just a filename, add the uploads prefix
  if (!imageUrl.startsWith('/')) {
    return `/uploads/${imageUrl}`;
  }
  
  return imageUrl;
}

/**
 * Clean up preview URLs to prevent memory leaks
 */
export function cleanupPreviewUrl(url: string): void {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}