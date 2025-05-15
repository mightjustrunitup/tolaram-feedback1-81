
import React, { useRef } from "react";
import { toast } from "sonner";
import { CameraViewport } from "./CameraViewport";
import { CameraErrorState } from "./CameraErrorState";
import { CameraLoadingState } from "./CameraLoadingState";
import { CameraControls } from "./CameraControls";
import { CameraModal } from "./CameraModal";
import { useCamera } from "./hooks/useCamera";

interface CameraCaptureProps {
  isCameraActive: boolean;
  onToggleCamera: () => void;
  onCameraCapture: (imageData: string) => void;
  onImageUpload?: (files: FileList) => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  isCameraActive,
  onToggleCamera,
  onCameraCapture,
  onImageUpload
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { 
    videoRef, 
    canvasRef, 
    isLoading, 
    cameraError, 
    streamActive,
    capturePhoto 
  } = useCamera({ isCameraActive });

  const handleCaptureClick = () => {
    const imageData = capturePhoto();
    if (imageData) {
      onCameraCapture(imageData);
      console.log("Photo captured successfully");
    }
  };

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && onImageUpload) {
      onImageUpload(e.target.files);
      onToggleCamera(); // Close the camera modal
    }
  };

  return (
    <CameraModal isOpen={isCameraActive} onClose={onToggleCamera}>
      {/* Camera viewport */}
      <div className="relative w-full aspect-[3/4] bg-black overflow-hidden">
        {isLoading && <CameraLoadingState />}
        {cameraError && <CameraErrorState onSelectGallery={handleFileSelect} />}
        {!isLoading && !cameraError && <CameraViewport videoRef={videoRef} />}
      </div>
      
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Hidden file input for gallery selection */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        capture="environment"
      />
      
      {/* Action buttons */}
      <CameraControls 
        onCaptureClick={handleCaptureClick}
        onGalleryClick={handleFileSelect}
        disabled={isLoading || cameraError || !streamActive}
      />
    </CameraModal>
  );
};
