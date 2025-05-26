
import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { CameraViewport } from "./CameraViewport";
import { CameraErrorState } from "./CameraErrorState";
import { CameraControls } from "./CameraControls";
import { CameraModal } from "./CameraModal";
import { QRScanner } from "./QRScanner";
import { useCamera } from "./hooks/useCamera";
import { QRCodeService } from "@/services/qrCodeService";

interface CameraCaptureProps {
  isCameraActive: boolean;
  onToggleCamera: () => void;
  onCameraCapture: (imageData: string) => void;
  onImageUpload?: (files: FileList) => void;
  onQRCodeScanned?: (qrData: string, productInfo: any) => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  isCameraActive,
  onToggleCamera,
  onCameraCapture,
  onImageUpload,
  onQRCodeScanned
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isQRScanMode, setIsQRScanMode] = useState(false);
  
  const { 
    videoRef, 
    canvasRef, 
    cameraError, 
    streamActive,
    capturePhoto 
  } = useCamera({ isCameraActive: isCameraActive && !isQRScanMode });

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

  const handleQRScanClick = () => {
    console.log("Switching to QR scan mode");
    setIsQRScanMode(true);
  };

  const handleQRDetected = async (qrData: string) => {
    console.log("QR code detected:", qrData);
    
    try {
      // Process the QR code data
      const result = await QRCodeService.processQRCode(qrData);
      
      if (result.isValid) {
        // Check for duplicate submissions
        const duplicateCheck = await QRCodeService.checkDuplicateSubmission(result.productId);
        
        if (duplicateCheck.isDuplicate) {
          toast.error("This product has already been scanned. Duplicate submissions are not allowed.");
          return;
        }
        
        // Save the scanned product
        const saveResult = await QRCodeService.saveScannedProduct({
          product_id: result.productId,
          qr_data: qrData
        });
        
        if (saveResult.success) {
          toast.success("Product QR code verified successfully!");
          
          // Notify parent component
          if (onQRCodeScanned) {
            onQRCodeScanned(qrData, result.productInfo);
          }
          
          // Close the camera
          setIsQRScanMode(false);
          onToggleCamera();
        } else {
          toast.error("Failed to save scanned product data");
        }
      } else {
        toast.error("Invalid product QR code. Please scan a valid product code.");
      }
    } catch (error) {
      console.error("Error processing QR code:", error);
      toast.error("Error processing QR code. Please try again.");
    }
  };

  const handleCloseQRScanner = () => {
    setIsQRScanMode(false);
  };

  return (
    <CameraModal isOpen={isCameraActive} onClose={onToggleCamera}>
      {/* QR Scanner Mode */}
      {isQRScanMode && (
        <QRScanner
          isActive={isQRScanMode}
          onQRDetected={handleQRDetected}
          onClose={handleCloseQRScanner}
        />
      )}
      
      {/* Regular Camera Mode */}
      {!isQRScanMode && (
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
            onQRScanClick={onQRCodeScanned ? handleQRScanClick : undefined}
            disabled={cameraError || !streamActive}
          />
        </>
      )}
    </CameraModal>
  );
};
