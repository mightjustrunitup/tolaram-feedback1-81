
import React, { useRef, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Barcode, X, CheckCircle, Camera } from "lucide-react";
import { BarcodeService } from "@/services/barcodeService";

interface BarcodeScannerProps {
  isActive: boolean;
  onBarcodeDetected: (barcodeData: string) => void;
  onClose: () => void;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  isActive,
  onBarcodeDetected,
  onClose
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (isActive) {
      startCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isActive]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsScanning(true);
      }
    } catch (error) {
      console.error("Error starting camera:", error);
      toast.error("Could not access camera for barcode scanning");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsScanning(false);
  };

  const processBarcodeData = async (barcodeText: string) => {
    try {
      console.log("Processing barcode data:", barcodeText);
      
      // Process the barcode data through the service
      const result = await BarcodeService.processBarcodeData(barcodeText);
      
      if (result.isValid) {
        console.log("Valid barcode detected:", result);
        
        // Check for duplicate submissions
        const duplicateCheck = await BarcodeService.checkDuplicateSubmission(result.productId);
        
        if (duplicateCheck.isDuplicate) {
          toast.error("This product has already been scanned. Duplicate submissions are not allowed.");
          return false;
        }
        
        // Save the scanned product to backend
        const saveResult = await BarcodeService.saveScannedProduct({
          product_id: result.productId,
          barcode_data: barcodeText
        });
        
        if (saveResult.success) {
          console.log("Barcode data saved successfully:", saveResult);
          toast.success("Product barcode verified and saved successfully!");
          
          // Trigger the callback with the barcode data
          onBarcodeDetected(barcodeText);
          return true;
        } else {
          console.error("Failed to save barcode data:", saveResult.error);
          toast.error("Failed to save scanned product data");
          return false;
        }
      } else {
        console.log("Invalid barcode:", barcodeText);
        toast.error("Invalid product barcode. Please scan a valid product barcode.");
        return false;
      }
    } catch (error) {
      console.error("Error processing barcode:", error);
      toast.error("Error processing barcode. Please try again.");
      return false;
    }
  };

  const captureAndProcessImage = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob
    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const file = new File([blob], 'barcode_scan.jpg', { type: 'image/jpeg' });
      
      try {
        toast.info("Processing barcode...");
        
        // Extract barcode from image using OCR
        const result = await BarcodeService.extractBarcodeFromImage(file);
        
        if (result.barcode && result.confidence > 0.5) {
          console.log("Barcode extracted from image:", result.barcode);
          setScanResult(result.barcode);
          setIsScanning(false);
          
          // Process the extracted barcode data
          const success = await processBarcodeData(result.barcode);
          
          if (success) {
            // Close the scanner after successful processing
            setTimeout(() => {
              onClose();
            }, 1500);
          }
        } else {
          toast.error("No barcode detected. Please try again with a clearer image.");
        }
      } catch (error) {
        console.error("Error processing barcode:", error);
        toast.error("Error processing barcode. Please try again.");
      }
    }, 'image/jpeg', 0.8);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      toast.info("Processing barcode from image...");
      
      // Extract barcode from uploaded image
      const result = await BarcodeService.extractBarcodeFromImage(file);
      
      if (result.barcode && result.confidence > 0.5) {
        console.log("Barcode extracted from uploaded image:", result.barcode);
        setScanResult(result.barcode);
        setIsScanning(false);
        
        // Process the extracted barcode data
        const success = await processBarcodeData(result.barcode);
        
        if (success) {
          // Close the scanner after successful processing
          setTimeout(() => {
            onClose();
          }, 1500);
        }
      } else {
        toast.error("No barcode detected in the image. Please try a clearer image.");
      }
    } catch (error) {
      console.error("Error processing barcode:", error);
      toast.error("Error processing barcode. Please try again.");
    }
  };

  const handleRescan = () => {
    setScanResult(null);
    setIsScanning(true);
    startCamera();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  if (!isActive) return null;

  return (
    <div className="relative w-full h-full bg-black">
      {/* Close button */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="absolute right-2 top-2 z-50 bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 rounded-full"
        onClick={onClose}
      >
        <X size={18} />
      </Button>

      {/* Scanner viewport */}
      <div className="relative w-full h-full flex items-center justify-center">
        <video 
          ref={videoRef} 
          className="w-full h-full object-cover"
          playsInline
          muted
          autoPlay
        />
        
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />
        
        {/* Scanning overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-4 border-2 border-white/50 rounded-lg">
            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-indomie-yellow rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-indomie-yellow rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-indomie-yellow rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-indomie-yellow rounded-br-lg"></div>
          </div>
        </div>

        {/* Scanning status */}
        <div className="absolute bottom-32 left-0 right-0 text-center">
          {isScanning && !scanResult && (
            <div className="bg-black/60 backdrop-blur-sm mx-4 p-3 rounded-lg">
              <Barcode className="mx-auto mb-2 text-indomie-yellow" size={24} />
              <p className="text-white text-sm">Position barcode within the frame</p>
              <p className="text-white/80 text-xs mt-1">Tap the camera button to scan</p>
            </div>
          )}
          
          {scanResult && (
            <div className="bg-green-600/90 backdrop-blur-sm mx-4 p-3 rounded-lg">
              <CheckCircle className="mx-auto mb-2 text-white" size={24} />
              <p className="text-white text-sm font-medium">Barcode Detected & Saved!</p>
              <p className="text-white/80 text-xs mt-1 truncate">{scanResult}</p>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
        {scanResult ? (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleRescan}
              className="flex-1 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            >
              Scan Again
            </Button>
            <Button
              onClick={onClose}
              className="flex-1 bg-indomie-yellow text-black hover:bg-indomie-yellow/90"
            >
              Continue
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleUploadClick}
              className="flex-1 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            >
              Upload Image
            </Button>
            <Button
              onClick={captureAndProcessImage}
              disabled={!isScanning}
              className="flex-1 bg-indomie-yellow text-black hover:bg-indomie-yellow/90 disabled:opacity-50"
            >
              <Camera size={16} className="mr-2" />
              Scan Barcode
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
