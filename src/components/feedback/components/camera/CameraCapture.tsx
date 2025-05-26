
import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { CameraViewport } from "./CameraViewport";
import { CameraErrorState } from "./CameraErrorState";
import { CameraControls } from "./CameraControls";
import { CameraModal } from "./CameraModal";
import { BarcodeScanner } from "./BarcodeScanner";
import { useCamera } from "./hooks/useCamera";

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

  const handleBarcodeDetected = (barcodeData: string) => {
    console.log("Barcode detected and processed:", barcodeData);
    
    // Since the BarcodeScanner now handles the full processing flow,
    // we just need to notify the parent component
    if (onBarcodeScanned) {
      onBarcodeScanned(barcodeData, { barcode: barcodeData });
    }
    
    // Close the camera and barcode scanner
    setIsBarcodeScanMode(false);
    onToggleCamera();
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
