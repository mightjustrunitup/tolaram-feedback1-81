
import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { X } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { CameraViewport } from "./CameraViewport";
import { CameraErrorState } from "./CameraErrorState";
import { CameraLoadingState } from "./CameraLoadingState";
import { CameraControls } from "./CameraControls";

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [streamActive, setStreamActive] = useState(false);
  
  // Handle camera stream when active
  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const setupCamera = async () => {
      if (!isCameraActive) return;
      
      setIsLoading(true);
      setCameraError(false);
      setStreamActive(false);
      
      try {
        // Initialize camera immediately
        console.log("Accessing camera...");
        
        // Use a shorter timeout (5 seconds instead of 15)
        const cameraAccessPromise = navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            // Request lower resolution first for faster initialization
            width: { ideal: 640 },
            height: { ideal: 480 }
          }, 
          audio: false 
        });
        
        // Shorter timeout for camera access (5 seconds instead of 15)
        const timeoutPromise = new Promise<MediaStream>((_, reject) => {
          setTimeout(() => reject(new Error("Camera access timeout")), 5000);
        });
        
        stream = await Promise.race([cameraAccessPromise, timeoutPromise]);
        
        console.log("Camera access granted:", stream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          // Play video as soon as metadata is loaded
          videoRef.current.onloadedmetadata = () => {
            console.log("Video metadata loaded");
            if (videoRef.current) {
              videoRef.current.play()
                .then(() => {
                  console.log("Video playing successfully");
                  setIsLoading(false);
                  setStreamActive(true);
                })
                .catch(err => {
                  console.error("Error playing video:", err);
                  setCameraError(true);
                  setIsLoading(false);
                });
            }
          };
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        setCameraError(true);
        setIsLoading(false);
        toast.error("Could not access camera. Please check permissions.");
      }
    };
    
    // Start camera setup immediately without delay
    if (isCameraActive) {
      setupCamera();
    }
    
    return () => {
      console.log("Cleaning up camera stream");
      if (stream) {
        stream.getTracks().forEach(track => {
          console.log("Stopping track:", track);
          track.stop();
        });
      }
    };
  }, [isCameraActive]);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !streamActive) {
      console.log("Cannot capture - video or canvas not ready, or stream not active");
      toast.error("Camera is not ready. Please try again.");
      return;
    }
    
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      console.log("Capturing photo", { width: canvas.width, height: canvas.height });
      
      // Draw current video frame to canvas
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas content to data URL and pass to handler
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        onCameraCapture(imageData);
        console.log("Photo captured successfully");
      }
    } catch (error) {
      console.error("Error capturing photo:", error);
      toast.error("Failed to capture photo. Please try again.");
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
    <Dialog open={isCameraActive} onOpenChange={onToggleCamera}>
      <DialogContent className="sm:max-w-md p-0 border-0 shadow-xl bg-gradient-to-b from-gray-900 to-black rounded-xl overflow-hidden">
        <VisuallyHidden>
          <DialogTitle>Camera Capture</DialogTitle>
        </VisuallyHidden>
        
        <div className="relative flex flex-col items-center">
          {/* Close button overlay */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-2 z-50 bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 rounded-full"
            onClick={onToggleCamera}
          >
            <X size={18} />
          </Button>
          
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
          />
          
          {/* Action buttons */}
          <CameraControls 
            onCaptureClick={capturePhoto}
            onGalleryClick={handleFileSelect}
            disabled={isLoading || cameraError || !streamActive}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
