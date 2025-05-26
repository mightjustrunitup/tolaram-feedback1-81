
import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { CameraViewport } from "./CameraViewport";
import { CameraErrorState } from "./CameraErrorState";
import { CameraControls } from "./CameraControls";
import { CameraModal } from "./CameraModal";
import { BarcodeScanner } from "./BarcodeScanner";
import { useCamera } from "./hooks/useCamera";
import { BarcodeService } from "@/services/barcodeService";

interface CameraCaptureProps {
  isCameraActive: boolean;
  onToggleCamera: () => void;
  onCameraCapture: (imageData: string) => void;
  onImageUpload?: (files: FileList) => void;
  onBarcodeScanned?: (barcodeData: string, productInfo: any) => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  isCameraActive,
  onToggleCamera,
  onCameraCapture,
  onImageUpload,
  onBarcodeScanned
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isBarcodeScanMode, setIsBarcodeScanMode] = useState(false);
  
  const { 
    videoRef, 
    canvasRef, 
    cameraError, 
    streamActive,
    capturePhoto 
  } = useCamera({ isCameraActive: isCameraActive && !isBarcodeScanMode });

  const handleCaptureClick = () => {
    const imageData = capturePhoto();
    if (imageData) {
      onCameraCapture(imageData);
      console.log("Photo captured successfully");
    }
  };

  const handleFileSelect = () => {
    // Directly click the file input to open the gallery selector
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && onImageUpload) {
      onImageUpload(e.target.files);
      onToggleCamera(); // Close the camera modal after selection
    }
  };

  const handleBarcodeScanClick = () => {
    console.log("Switching to barcode scan mode");
    setIsBarcodeScanMode(true);
  };

  const handleBarcodeDetected = async (barcodeData: string) => {
    console.log("Barcode detected:", barcodeData);
    
    try {
      // Process the barcode data
      const result = await BarcodeService.processBarcodeData(barcodeData);
      
      if (result.isValid) {
        // Check for duplicate submissions
        const duplicateCheck = await BarcodeService.checkDuplicateSubmission(result.productId);
        
        if (duplicateCheck.isDuplicate) {
          toast.error("This product has already been scanned. Duplicate submissions are not allowed.");
          return;
        }
        
        // Save the scanned product
        const saveResult = await BarcodeService.saveScannedProduct({
          product_id: result.productId,
          barcode_data: barcodeData
        });
        
        if (saveResult.success) {
          toast.success("Product barcode verified successfully!");
          
          // Notify parent component
          if (onBarcodeScanned) {
            onBarcodeScanned(barcodeData, result.productInfo);
          }
          
          // Close the camera
          setIsBarcodeScanMode(false);
          onToggleCamera();
        } else {
          toast.error("Failed to save scanned product data");
        }
      } else {
        toast.error("Invalid product barcode. Please scan a valid product barcode.");
      }
    } catch (error) {
      console.error("Error processing barcode:", error);
      toast.error("Error processing barcode. Please try again.");
    }
  };

  const handleCloseBarcodeScanner = () => {
    setIsBarcodeScanMode(false);
  };

  return (
    <CameraModal isOpen={isCameraActive} onClose={onToggleCamera}>
      {/* Barcode Scanner Mode */}
      {isBarcodeScanMode && (
        <BarcodeScanner
          isActive={isBarcodeScanMode}
          onBarcodeDetected={handleBarcodeDetected}
          onClose={handleCloseBarcodeScanner}
        />
      )}
      
      {/* Regular Camera Mode */}
      {!isBarcodeScanMode && (
        <>
          {/* Camera viewport */}
          <div className="relative w-full aspect-[3/4] bg-black overflow-hidden">
            {cameraError && <CameraErrorState onSelectGallery={handleFileSelect} />}
            {!cameraError && <CameraViewport videoRef={videoRef} />}
          </div>
          
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Hidden file input for gallery selection */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            multiple
          />
          
          {/* Action buttons */}
          <CameraControls 
            onCaptureClick={handleCaptureClick}
            onGalleryClick={handleFileSelect}
            onBarcodeScanClick={onBarcodeScanned ? handleBarcodeScanClick : undefined}
            disabled={cameraError || !streamActive}
          />
        </>
      )}
    </CameraModal>
  );
};
