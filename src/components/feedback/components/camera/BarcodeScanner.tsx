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
  const [isProcessing, setIsProcessing] = useState(false);

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
      setIsProcessing(true);
      
      // Clean the barcode data - keep original if it's already clean, otherwise extract digits
      let cleanBarcode = barcodeText.trim();
      if (!/^\d+$/.test(cleanBarcode)) {
        // If not all digits, extract digits
        cleanBarcode = barcodeText.replace(/\D/g, '');
      }
      
      console.log("Cleaned barcode:", cleanBarcode);
      
      if (!cleanBarcode || cleanBarcode.length < 6) {
        toast.error("Invalid barcode format. Barcode too short.");
        setIsProcessing(false);
        return false;
      }
      
      // Save the scanned product to backend first (removed duplicate check for now)
      console.log("Saving to database...");
      const saveResult = await BarcodeService.saveScannedProduct({
        product_id: cleanBarcode,
        barcode_data: barcodeText
      });
      
      if (saveResult.success) {
        console.log("Barcode data saved successfully:", saveResult);
        toast.success("Product barcode scanned and saved successfully!");
        
        // Trigger the callback with the barcode data
        onBarcodeDetected(cleanBarcode);
        setIsProcessing(false);
        return true;
      } else {
        console.error("Failed to save barcode data:", saveResult.error);
        toast.error("Failed to save scanned product: " + (saveResult.error || "Unknown error"));
        setIsProcessing(false);
        return false;
      }
    } catch (error) {
      console.error("Error processing barcode:", error);
      toast.error("Error processing barcode: " + (error as Error).message);
      setIsProcessing(false);
      return false;
    }
  };

  const captureAndProcessImage = async () => {
    if (!videoRef.current || !canvasRef.current || isProcessing) return;

    setIsProcessing(true);
    toast.info("Scanning for barcode...");

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (!context) {
      setIsProcessing(false);
      return;
    }

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to blob
    canvas.toBlob(async (blob) => {
      if (!blob) {
        setIsProcessing(false);
        return;
      }

      const file = new File([blob], 'barcode_scan.jpg', { type: 'image/jpeg' });
      
      try {
        // Extract barcode from image using OCR
        console.log("Starting OCR extraction...");
        const result = await BarcodeService.extractBarcodeFromImage(file);
        
        console.log("OCR result:", result);
        
        if (result.barcode && result.barcode.length >= 6) {
          console.log("Valid barcode extracted:", result.barcode);
          setScanResult(result.barcode);
          setIsScanning(false);
          
          // Process the extracted barcode data
          const success = await processBarcodeData(result.barcode);
          
          if (success) {
            // Close the scanner after successful processing
            setTimeout(() => {
              onClose();
            }, 2000);
          }
        } else {
          toast.error("No valid barcode detected. Please try again with a clearer image.");
          setIsProcessing(false);
        }
      } catch (error) {
        console.error("Error processing barcode:", error);
        toast.error("Error processing barcode: " + (error as Error).message);
        setIsProcessing(false);
      }
    }, 'image/jpeg', 0.8);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || isProcessing) return;

    setIsProcessing(true);
    toast.info("Processing barcode from image...");
    
    try {
      // Extract barcode from uploaded image
      console.log("Processing uploaded image...");
      const result = await BarcodeService.extractBarcodeFromImage(file);
      
      console.log("Upload OCR result:", result);
      
      if (result.barcode && result.barcode.length >= 6) {
        console.log("Valid barcode extracted from upload:", result.barcode);
        setScanResult(result.barcode);
        setIsScanning(false);
        
        // Process the extracted barcode data
        const success = await processBarcodeData(result.barcode);
        
        if (success) {
          // Close the scanner after successful processing
          setTimeout(() => {
            onClose();
          }, 2000);
        }
      } else {
        toast.error("No valid barcode detected in the image. Please try a clearer image.");
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Error processing barcode:", error);
      toast.error("Error processing barcode: " + (error as Error).message);
      setIsProcessing(false);
    }
  };

  const handleRescan = () => {
    setScanResult(null);
    setIsScanning(true);
    setIsProcessing(false);
    startCamera();
  };

  const handleUploadClick = () => {
    if (!isProcessing) {
      fileInputRef.current?.click();
    }
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
        disabled={isProcessing}
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
          {isProcessing && (
            <div className="bg-blue-600/90 backdrop-blur-sm mx-4 p-3 rounded-lg">
              <div className="animate-spin mx-auto mb-2 w-6 h-6 border-2 border-white border-t-transparent rounded-full"></div>
              <p className="text-white text-sm font-medium">Processing barcode...</p>
            </div>
          )}
          
          {isScanning && !scanResult && !isProcessing && (
            <div className="bg-black/60 backdrop-blur-sm mx-4 p-3 rounded-lg">
              <Barcode className="mx-auto mb-2 text-indomie-yellow" size={24} />
              <p className="text-white text-sm">Position barcode within the frame</p>
              <p className="text-white/80 text-xs mt-1">Tap the camera button to scan</p>
            </div>
          )}
          
          {scanResult && (
            <div className="bg-green-600/90 backdrop-blur-sm mx-4 p-3 rounded-lg">
              <CheckCircle className="mx-auto mb-2 text-white" size={24} />
              <p className="text-white text-sm font-medium">Barcode Scanned Successfully!</p>
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
              disabled={isProcessing}
              className="flex-1 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 disabled:opacity-50"
            >
              Scan Again
            </Button>
            <Button
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 bg-indomie-yellow text-black hover:bg-indomie-yellow/90 disabled:opacity-50"
            >
              Continue
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleUploadClick}
              disabled={isProcessing}
              className="flex-1 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 disabled:opacity-50"
            >
              Upload Image
            </Button>
            <Button
              onClick={captureAndProcessImage}
              disabled={!isScanning || isProcessing}
              className="flex-1 bg-indomie-yellow text-black hover:bg-indomie-yellow/90 disabled:opacity-50"
            >
              <Camera size={16} className="mr-2" />
              {isProcessing ? "Processing..." : "Scan Barcode"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
