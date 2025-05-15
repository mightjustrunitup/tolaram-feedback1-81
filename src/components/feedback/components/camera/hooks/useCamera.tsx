
import { useRef, useEffect, useState } from "react";
import { toast } from "sonner";

interface UseCameraProps {
  isCameraActive: boolean;
}

export const useCamera = ({ isCameraActive }: UseCameraProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraError, setCameraError] = useState(false);
  const [streamActive, setStreamActive] = useState(false);
  
  // Handle camera stream when active
  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const setupCamera = async () => {
      if (!isCameraActive) return;
      
      setCameraError(false);
      setStreamActive(false);
      
      try {
        console.log("Accessing camera...");
        
        // Check if camera access is available
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          console.error("Camera API not available in this browser");
          setCameraError(true);
          return;
        }
        
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            width: { ideal: 640 },
            height: { ideal: 480 }
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
                  setStreamActive(true);
                })
                .catch(err => {
                  console.error("Error playing video:", err);
                  setCameraError(true);
                });
            }
          };
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        setCameraError(true);
        
        // Check if it's a permissions error specifically
        if (error instanceof DOMException && 
            (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError')) {
          toast.error("Camera access denied. Please check your browser settings.");
        } else {
          toast.error("Could not access camera. It may not be available on this device.");
        }
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
      return null;
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
    cameraError,
    streamActive,
    capturePhoto
  };
};
