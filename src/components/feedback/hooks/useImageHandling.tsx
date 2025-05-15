
import { useState } from "react";
import { toast } from "sonner";

export function useImageHandling() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  
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

  // Handle taking a photo with device camera
  const handleCameraCapture = (imageData: string) => {
    setUploadedImages(prev => [...prev, imageData]);
    setIsCameraActive(false);
    toast.success("Photo captured successfully");
  };

  // Toggle camera on/off
  const toggleCamera = () => {
    setIsCameraActive(prev => !prev);
  };

  // Handle removing uploaded images
  const handleImageRemove = (index: number) => {
    setUploadedImages(prevImages => {
      const updatedImages = [...prevImages];
      // If the image URL starts with blob:, it's a local file URL that needs to be revoked
      if (updatedImages[index].startsWith('blob:')) {
        URL.revokeObjectURL(updatedImages[index]);
      }
      // Remove the image from the array
      updatedImages.splice(index, 1);
      toast.info("Image removed");
      return updatedImages;
    });
  };

  return {
    uploadedImages,
    isCameraActive,
    handleImageUpload,
    handleImageRemove,
    handleCameraCapture,
    toggleCamera
  };
}
