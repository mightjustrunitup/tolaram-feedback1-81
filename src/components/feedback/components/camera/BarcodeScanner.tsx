
import React, { useRef, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Barcode, X, CheckCircle, Copy } from "lucide-react";
import { BarcodeService } from "@/services/barcodeService";
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';

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
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [scanDetails, setScanDetails] = useState<{
    barcode: string;
    type: string;
    confidence: number;
  } | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [reader, setReader] = useState<BrowserMultiFormatReader | null>(null);
  const scanIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive) {
      initializeScanner();
    }

    return () => {
      cleanup();
    };
  }, [isActive]);

  const initializeScanner = async () => {
    try {
      console.log("Initializing ultra-fast ZXing barcode scanner...");
      
      const codeReader = new BrowserMultiFormatReader();
      
      // Configure hints for maximum speed and accuracy
      const hints = new Map();
      hints.set(2, true); // PURE_BARCODE
      hints.set(3, true); // TRY_HARDER
      codeReader.hints = hints;
      
      setReader(codeReader);
      
      // Get video devices
      const videoInputDevices = await codeReader.listVideoInputDevices();
      console.log("Available video devices:", videoInputDevices);
      
      // Prioritize back camera for better barcode scanning
      const backCamera = videoInputDevices.find(device => 
        device.label.toLowerCase().includes('back') || 
        device.label.toLowerCase().includes('rear') ||
        device.label.toLowerCase().includes('environment')
      );
      
      const selectedDeviceId = backCamera ? backCamera.deviceId : videoInputDevices[0]?.deviceId;
      
      if (!selectedDeviceId) {
        toast.error("No camera devices found");
        return;
      }

      console.log("Starting ultra-fast barcode detection with device:", selectedDeviceId);
      
      // Get optimized stream for barcode scanning
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          deviceId: selectedDeviceId,
          facingMode: 'environment',
          width: { ideal: 1920, min: 640 }, // Higher resolution for better scanning
          height: { ideal: 1080, min: 480 },
          frameRate: { ideal: 60, min: 30 } // Higher framerate for faster detection
        }
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        videoRef.current.onloadedmetadata = () => {
          console.log("Video metadata loaded, starting ultra-fast continuous scanning");
          if (videoRef.current) {
            videoRef.current.play()
              .then(() => {
                console.log("Video playing successfully - ultra-fast mode enabled");
                startUltraFastScanning(codeReader);
              })
              .catch(err => {
                console.error("Error playing video:", err);
                toast.error("Could not start video");
              });
          }
        };
      }
      
      toast.success("Ultra-fast barcode scanner ready!");
      
    } catch (error) {
      console.error("Error initializing barcode scanner:", error);
      toast.error("Could not access camera for barcode scanning");
    }
  };

  const startUltraFastScanning = (codeReader: BrowserMultiFormatReader) => {
    // Clear any existing interval
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }
    
    // Ultra-fast scanning every 50ms for maximum responsiveness
    scanIntervalRef.current = window.setInterval(() => {
      if (videoRef.current && !isProcessing && !scanResult) {
        try {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          
          if (context && videoRef.current.videoWidth > 0) {
            // Use full resolution for better accuracy
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0);
            
            // Convert to high-quality image for scanning
            const dataURL = canvas.toDataURL('image/jpeg', 0.95);
            const img = new Image();
            
            img.onload = () => {
              codeReader.decodeFromImageElement(img)
                .then((result) => {
                  if (result && result.getText()) {
                    console.log("Ultra-fast barcode detected:", result.getText());
                    handleBarcodeDetected(result.getText());
                  }
                })
                .catch((error) => {
                  // Silently ignore NotFoundException - it's normal when no barcode is present
                  if (!(error instanceof NotFoundException)) {
                    console.debug("Scanning error:", error.message);
                  }
                });
            };
            
            img.src = dataURL;
          }
        } catch (error) {
          console.debug("Frame scan error:", error);
        }
      }
    }, 50); // Ultra-fast 50ms intervals for instant detection
  };

  const cleanup = () => {
    console.log("Cleaning up ultra-fast barcode scanner...");
    
    // Clear scanning interval
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    
    if (reader) {
      try {
        reader.reset();
      } catch (error) {
        console.error("Error resetting reader:", error);
      }
    }
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    setReader(null);
  };

  const handleBarcodeDetected = async (barcodeText: string) => {
    if (isProcessing || scanResult) return; // Prevent multiple detections
    
    try {
      console.log("Processing ultra-fast detected barcode:", barcodeText);
      setIsProcessing(true);
      
      // Stop the scanner immediately for faster processing
      cleanup();
      
      // Clean and validate barcode
      let cleanBarcode = barcodeText.trim();
      if (!/^\d+$/.test(cleanBarcode)) {
        cleanBarcode = barcodeText.replace(/\D/g, '');
      }
      
      console.log("Cleaned barcode:", cleanBarcode);
      
      if (!cleanBarcode || cleanBarcode.length < 6) {
        toast.error("Invalid barcode format. Barcode too short.");
        setIsProcessing(false);
        return;
      }
      
      // Process the barcode to get type information
      const processResult = await BarcodeService.processBarcodeData(cleanBarcode);
      
      // Set scan details for display
      setScanDetails({
        barcode: cleanBarcode,
        type: processResult.productInfo?.type || 'Unknown',
        confidence: 1.0
      });
      
      setScanResult(cleanBarcode);
      
      // Save with ultra-fast processing
      console.log("Ultra-fast saving to database...");
      const saveResult = await BarcodeService.saveScannedProduct({
        product_id: cleanBarcode,
        barcode_data: barcodeText
      });
      
      if (saveResult.success) {
        console.log("Ultra-fast barcode save successful:", saveResult);
        toast.success("Barcode scanned and saved in record time!");
        
        // Trigger callback
        onBarcodeDetected(cleanBarcode);
        
        // Quick auto-close after success
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        console.error("Failed to save barcode data:", saveResult.error);
        toast.error("Scanned but failed to save: " + (saveResult.error || "Unknown error"));
        
        // Still allow continuation
        onBarcodeDetected(cleanBarcode);
        setTimeout(() => {
          onClose();
        }, 1500);
      }
      
      setIsProcessing(false);
    } catch (error) {
      console.error("Error processing barcode:", error);
      toast.error("Error processing barcode: " + (error as Error).message);
      setIsProcessing(false);
    }
  };

  const copyBarcodeToClipboard = async () => {
    if (scanResult) {
      try {
        await navigator.clipboard.writeText(scanResult);
        toast.success("Barcode copied to clipboard!");
      } catch (error) {
        console.error("Failed to copy to clipboard:", error);
        toast.error("Failed to copy barcode");
      }
    }
  };

  const handleRescan = () => {
    setScanResult(null);
    setScanDetails(null);
    setIsProcessing(false);
    initializeScanner();
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
        
        {/* Enhanced scanning overlay for ultra-fast detection */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-4 border-2 border-white/50 rounded-lg">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-400 rounded-tl-lg animate-pulse"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-400 rounded-tr-lg animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-400 rounded-bl-lg animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-400 rounded-br-lg animate-pulse"></div>
          </div>
          
          {/* Ultra-fast scanning line animation */}
          {!scanResult && !isProcessing && (
            <div className="absolute inset-4 flex items-center justify-center">
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse"></div>
            </div>
          )}
        </div>

        {/* Success result display */}
        {scanResult && scanDetails && (
          <div className="absolute top-20 left-4 right-4 bg-green-600/95 backdrop-blur-sm p-4 rounded-lg border border-green-400/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-white" size={20} />
                <h3 className="text-white font-semibold">Ultra-Fast Detection!</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyBarcodeToClipboard}
                className="text-white hover:bg-white/20 p-1"
              >
                <Copy size={16} />
              </Button>
            </div>
            
            <div className="space-y-2 text-white">
              <div className="bg-white/20 p-3 rounded font-mono text-lg tracking-wider">
                {scanDetails.barcode}
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-white/80">Type:</span>
                  <div className="font-medium">{scanDetails.type}</div>
                </div>
                <div>
                  <span className="text-white/80">Status:</span>
                  <div className="font-medium text-green-300">Ultra-Fast ⚡</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced scanning status */}
        <div className="absolute bottom-32 left-0 right-0 text-center">
          {isProcessing && (
            <div className="bg-blue-600/90 backdrop-blur-sm mx-4 p-3 rounded-lg">
              <div className="animate-spin mx-auto mb-2 w-6 h-6 border-2 border-white border-t-transparent rounded-full"></div>
              <p className="text-white text-sm font-medium">Ultra-fast processing...</p>
            </div>
          )}
          
          {!scanResult && !isProcessing && (
            <div className="bg-black/60 backdrop-blur-sm mx-4 p-3 rounded-lg">
              <Barcode className="mx-auto mb-2 text-green-400 animate-pulse" size={24} />
              <p className="text-white text-sm font-bold">Ultra-Fast Scanning Active</p>
              <p className="text-green-300 text-xs mt-1">⚡ 50ms detection intervals</p>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced controls */}
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
              className="flex-1 bg-green-500 text-black hover:bg-green-400 disabled:opacity-50 font-semibold"
            >
              Continue ⚡
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-white/80 text-sm">
              {isProcessing ? "Ultra-fast processing..." : "⚡ Ultra-fast scanning active..."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
