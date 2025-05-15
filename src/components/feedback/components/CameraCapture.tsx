
import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Camera, FileImage } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

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
        console.log("Accessing camera...");
        // Request camera access with environment camera preferred (back camera on mobile)
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }, 
          audio: false 
        });
        
        console.log("Camera access granted:", stream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
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
  }, [isCameraActive, onToggleCamera]);

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
      <DialogContent className="sm:max-w-md p-0">
        <VisuallyHidden>
          <DialogTitle>Camera Capture</DialogTitle>
        </VisuallyHidden>
        
        <div className="flex flex-col items-center space-y-4 p-4">
          <div className="relative w-full aspect-[3/4] bg-black rounded-lg overflow-hidden">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
                <span className="text-white ml-2">Activating camera...</span>
              </div>
            )}
            
            {cameraError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <p className="text-white text-center px-4">Camera access denied or not available.</p>
              </div>
            )}
            
            <video 
              ref={videoRef} 
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay 
              playsInline 
              muted
            />
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
          
          <div className="flex justify-center gap-4 w-full">
            <Button
              type="button"
              variant="secondary"
              onClick={handleFileSelect}
              className="flex items-center gap-2"
            >
              <FileImage size={16} />
              Select from Gallery
            </Button>
            <Button 
              type="button" 
              onClick={capturePhoto}
              className="bg-indomie-red hover:bg-indomie-red/90"
              disabled={isLoading || cameraError || !streamActive}
            >
              Capture Photo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
