
import { useState } from "react";
import { toast } from "sonner";

export function useImageHandling() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  
  // Handle image uploads
  const handleImageUpload = (files: FileList) => {
    if (files) {
      const newImages: string[] = [];
      
      Array.from(files).forEach(file => {
        // Limit to image files
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not an image file`);
          return;
        }
        
        // Create URL for preview
        const imageUrl = URL.createObjectURL(file);
        newImages.push(imageUrl);
      });
      
      if (newImages.length > 0) {
        setUploadedImages(prev => [...prev, ...newImages]);
        toast.success(`${newImages.length} image${newImages.length > 1 ? 's' : ''} uploaded`);
      }
    }
  };

  // Handle removing uploaded images
  const handleImageRemove = (index: number) => {
    setUploadedImages(prevImages => {
      const updatedImages = [...prevImages];
      // Release the object URL to avoid memory leaks
      URL.revokeObjectURL(updatedImages[index]);
      // Remove the image from the array
      updatedImages.splice(index, 1);
      toast.info("Image removed");
      return updatedImages;
    });
  };

  return {
    uploadedImages,
    handleImageUpload,
    handleImageRemove
  };
}
