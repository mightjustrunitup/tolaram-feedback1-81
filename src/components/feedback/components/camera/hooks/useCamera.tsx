
import { useRef, useEffect, useState } from "react";
import { toast } from "sonner";

interface UseCameraProps {
  isCameraActive: boolean;
}

export const useCamera = ({ isCameraActive }: UseCameraProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
        
        const cameraAccessPromise = navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            width: { ideal: 640 },
            height: { ideal: 480 }
          }, 
          audio: false 
        });
        
        const timeoutPromise = new Promise<MediaStream>((_, reject) => {
          setTimeout(() => reject(new Error("Camera access timeout")), 5000);
        });
        
        stream = await Promise.race([cameraAccessPromise, timeoutPromise]);
        
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
        
        // Convert canvas content to data URL
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        return imageData;
      }
    } catch (error) {
      console.error("Error capturing photo:", error);
      toast.error("Failed to capture photo. Please try again.");
      return null;
    }
  };

  return {
    videoRef,
    canvasRef,
    isLoading,
    cameraError,
    streamActive,
    capturePhoto
  };
};
