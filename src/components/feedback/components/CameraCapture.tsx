
import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

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

  // Handle camera stream when active
  useEffect(() => {
    let stream: MediaStream | null = null;
    
    if (isCameraActive && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
        .then((mediaStream) => {
          stream = mediaStream;
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
            videoRef.current.play().catch(error => console.error("Error playing video:", error));
          }
        })
        .catch(error => {
          console.error("Error accessing camera:", error);
          if (onToggleCamera) onToggleCamera();
          toast({
            title: "Camera Error",
            description: "Could not access camera. Please check permissions.",
            variant: "destructive",
          });
        });
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
        const imageData = canvas.toDataURL('image/jpeg');
        onCameraCapture(imageData);
      }
    }
  };

  return (
    <Dialog open={isCameraActive} onOpenChange={onToggleCamera}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center space-y-4 pt-2">
          <div className="relative w-full aspect-[3/4] bg-black rounded-lg overflow-hidden">
            <video 
              ref={videoRef} 
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay 
              playsInline 
            />
          </div>
          <canvas ref={canvasRef} className="hidden" />
          
          <div className="flex justify-center gap-4 w-full">
            <Button
              type="button"
              variant="secondary"
              onClick={onToggleCamera}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={capturePhoto}
              className="bg-indomie-red hover:bg-indomie-red/90"
            >
              Capture Photo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
