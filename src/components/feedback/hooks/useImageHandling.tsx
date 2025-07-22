import { useState } from "react";
import { toast } from "sonner";

export function useImageHandling() {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [scannedBarcodes, setScannedBarcodes] = useState<Array<{
    barcodeData: string;
    productInfo: any;
    timestamp: number;
  }>>([]);
  
  // Keep backward compatibility - return the first scanned barcode
  const scannedBarcodeData = scannedBarcodes.length > 0 ? scannedBarcodes[0].barcodeData : null;
  const scannedProductInfo = scannedBarcodes.length > 0 ? scannedBarcodes[0].productInfo : null;
  
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

  // Handle barcode scanning with duplicate detection
  const handleBarcodeScanned = (barcodeData: string, productInfo?: any) => {
    console.log("Barcode scanned:", barcodeData, productInfo);
    
    // Check for duplicates in current session
    const isDuplicate = scannedBarcodes.some(scanned => scanned.barcodeData === barcodeData);
    
    if (isDuplicate) {
      toast.error("This barcode has already been scanned in this session");
      return;
    }
    
    const newBarcode = {
      barcodeData,
      productInfo: productInfo || { barcode: barcodeData },
      timestamp: Date.now()
    };
    
    setScannedBarcodes(prev => [...prev, newBarcode]);
    toast.success(`Barcode ${scannedBarcodes.length + 1} scanned successfully!`);
  };

  // Clear all barcode data
  const clearBarcodeData = () => {
    setScannedBarcodes([]);
  };

  // Remove a specific barcode by index
  const removeBarcodeByIndex = (index: number) => {
    setScannedBarcodes(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      toast.info("Barcode removed");
      return updated;
    });
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

  // Images are now handled directly in the feedback submission
  const uploadFilesToStorage = async (feedbackId: string) => {
    // This function is no longer needed as images are sent as base64 to PHP
    // Return the uploaded files for backwards compatibility
    return uploadedImages;
  };

  return {
    uploadedImages,
    uploadedImageUrls,
    isCameraActive,
    isUploading,
    scannedBarcodeData, // Backward compatibility
    scannedProductInfo, // Backward compatibility
    scannedBarcodes, // New: array of all scanned barcodes
    handleImageUpload,
    handleImageRemove,
    handleCameraCapture,
    handleBarcodeScanned,
    toggleCamera,
    uploadFilesToStorage,
    clearBarcodeData,
    removeBarcodeByIndex // New: remove specific barcode
  };
}
