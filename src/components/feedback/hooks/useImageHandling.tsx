
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function useImageHandling() {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [scannedQRData, setScannedQRData] = useState<string | null>(null);
  const [scannedProductInfo, setScannedProductInfo] = useState<any>(null);
  
  // Handle image uploads
  const handleImageUpload = (files: FileList) => {
    if (files) {
      const newFiles: File[] = [];
      const newImageUrls: string[] = [];
      
      Array.from(files).forEach(file => {
        // Limit to image files
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not an image file`);
          return;
        }
        
        // Create URL for preview
        const imageUrl = URL.createObjectURL(file);
        newFiles.push(file);
        newImageUrls.push(imageUrl);
      });
      
      if (newFiles.length > 0) {
        console.log("New images added:", newFiles.map(file => file.name));
        setUploadedImages(prev => [...prev, ...newFiles]);
        setUploadedImageUrls(prev => [...prev, ...newImageUrls]);
        toast.success(`${newFiles.length} image${newFiles.length > 1 ? 's' : ''} added`);
      }
    }
  };

  // Handle taking a photo with device camera
  const handleCameraCapture = async (imageData: string) => {
    console.log("Camera capture: Image data received");
    
    // Convert base64 data to a File object
    try {
      const res = await fetch(imageData);
      const blob = await res.blob();
      const file = new File([blob], `camera_${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      setUploadedImages(prev => [...prev, file]);
      setUploadedImageUrls(prev => [...prev, imageData]);
      setIsCameraActive(false);
      toast.success("Photo captured successfully");
    } catch (error) {
      console.error("Error converting camera image:", error);
      toast.error("Failed to process camera image");
    }
  };

  // Handle QR code scanning
  const handleQRCodeScanned = (qrData: string, productInfo?: any) => {
    console.log("QR code scanned:", qrData, productInfo);
    setScannedQRData(qrData);
    setScannedProductInfo(productInfo);
    toast.success("Product QR code scanned successfully!");
  };

  // Toggle camera on/off
  const toggleCamera = () => {
    setIsCameraActive(prev => !prev);
  };

  // Handle removing uploaded images
  const handleImageRemove = (index: number) => {
    setUploadedImages(prevImages => {
      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1);
      return updatedImages;
    });
    
    setUploadedImageUrls(prevUrls => {
      const updatedUrls = [...prevUrls];
      // If the image URL starts with blob:, it's a local file URL that needs to be revoked
      if (updatedUrls[index].startsWith('blob:')) {
        URL.revokeObjectURL(updatedUrls[index]);
      }
      // Remove the URL from the array
      updatedUrls.splice(index, 1);
      
      toast.info("Image removed");
      return updatedUrls;
    });
  };

  // Upload files to Supabase storage
  const uploadFilesToStorage = async (feedbackId: string) => {
    if (uploadedImages.length === 0) return [];
    
    console.log(`Uploading ${uploadedImages.length} files to storage for feedback ${feedbackId}`);
    setIsUploading(true);
    
    const imageUrls: string[] = [];
    
    try {
      for (const file of uploadedImages) {
        const filename = `${feedbackId}_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        
        console.log(`Uploading ${filename} to feedback-images bucket`);
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('feedback-images')
          .upload(filename, file);
          
        if (uploadError) {
          console.error("Error uploading file:", uploadError);
          toast.error(`Failed to upload ${file.name}`);
          continue;
        }
        
        if (uploadData) {
          // Get the public URL
          const { data: publicUrlData } = supabase.storage
            .from('feedback-images')
            .getPublicUrl(filename);
          
          if (publicUrlData && publicUrlData.publicUrl) {
            imageUrls.push(publicUrlData.publicUrl);
            console.log("Uploaded image URL:", publicUrlData.publicUrl);
            
            // Verify the image is accessible by making a HEAD request
            try {
              const response = await fetch(publicUrlData.publicUrl, { method: 'HEAD' });
              if (!response.ok) {
                console.warn(`Image might not be publicly accessible: ${publicUrlData.publicUrl}`);
              } else {
                console.log(`Verified image is accessible: ${publicUrlData.publicUrl}`);
              }
            } catch (error) {
              console.warn(`Could not verify image accessibility: ${error}`);
            }
          }
        }
      }
      
      if (imageUrls.length > 0) {
        toast.success(`Successfully uploaded ${imageUrls.length} image${imageUrls.length > 1 ? 's' : ''}`);
      }
      
      return imageUrls;
    } catch (error) {
      console.error("Error in file upload process:", error);
      toast.error("Error uploading images. Please try again.");
      return [];
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadedImages,
    uploadedImageUrls,
    isCameraActive,
    isUploading,
    scannedQRData,
    scannedProductInfo,
    handleImageUpload,
    handleImageRemove,
    handleCameraCapture,
    handleQRCodeScanned,
    toggleCamera,
    uploadFilesToStorage
  };
}
