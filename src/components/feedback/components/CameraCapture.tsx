
import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CameraCaptureProps {
  isCameraActive: boolean;
  onToggleCamera: () => void;
  onCameraCapture: (imageData: string) => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  isCameraActive,
  onToggleCamera,
  onCameraCapture,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cameraError, setCameraError] = useState(false);

  // Handle camera stream when active
  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const setupCamera = async () => {
      if (!isCameraActive || !videoRef.current) return;
      
      setIsLoading(true);
      setCameraError(false);
      
      try {
        // Request camera access with environment camera preferred (back camera on mobile)
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }, 
          audio: false 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Play needs to be called as a result of user gesture on some browsers
          await videoRef.current.play();
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        setCameraError(true);
        setIsLoading(false);
        toast.error("Could not access camera. Please check permissions.");
        if (onToggleCamera) onToggleCamera();
      }
    };
    
    if (isCameraActive) {
      setupCamera();
    }
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraActive, onToggleCamera]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && onCameraCapture) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw current video frame to canvas
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas content to data URL and pass to handler
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        onCameraCapture(imageData);
      }
    }
  };

  return (
    <Dialog open={isCameraActive} onOpenChange={onToggleCamera}>
      <DialogContent className="sm:max-w-md p-0">
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
          
          <div className="flex justify-center gap-4 w-full">
            <Button
              type="button"
              variant="secondary"
              onClick={onToggleCamera}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={capturePhoto}
              className="bg-indomie-red hover:bg-indomie-red/90"
              disabled={isLoading || cameraError}
            >
              Capture Photo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
