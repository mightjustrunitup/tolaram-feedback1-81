
import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Camera, FileImage, X } from "lucide-react";
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
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm z-20">
                <Loader2 className="h-10 w-10 animate-spin text-indomie-yellow mb-2" />
                <span className="text-white font-medium">Activating camera...</span>
              </div>
            )}
            
            {cameraError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-20 p-6">
                <Camera className="h-14 w-14 text-indomie-yellow/70 mb-3" />
                <p className="text-white text-center font-medium">Camera access denied or not available.</p>
                <Button 
                  onClick={handleFileSelect} 
                  variant="outline" 
                  className="mt-4 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                >
                  <FileImage size={16} className="mr-2" />
                  Select from Gallery
                </Button>
              </div>
            )}
            
            <video 
              ref={videoRef} 
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay 
              playsInline 
              muted
            />
            
            {/* Video overlay */}
            <div className="absolute inset-0 pointer-events-none border-[1px] border-white/20 z-10">
              <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-indomie-yellow"></div>
              <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-indomie-yellow"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-indomie-yellow"></div>
              <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-indomie-yellow"></div>
            </div>
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
          <div className="w-full p-4 bg-gradient-to-t from-black to-black/80">
            <div className="flex justify-between items-center gap-4 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={handleFileSelect}
                className="flex-1 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              >
                <FileImage size={16} className="mr-2" />
                Gallery
              </Button>
              
              <Button 
                type="button" 
                onClick={capturePhoto}
                className="flex-1 bg-indomie-yellow text-black hover:bg-indomie-yellow/90 font-medium"
                disabled={isLoading || cameraError || !streamActive}
              >
                <Camera size={16} className="mr-2" />
                Capture
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
