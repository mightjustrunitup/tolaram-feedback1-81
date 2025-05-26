
import React, { useRef, useEffect, useState } from "react";
import QrScanner from "qr-scanner";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { QrCode, X, CheckCircle } from "lucide-react";

interface QRScannerProps {
  isActive: boolean;
  onQRDetected: (qrData: string) => void;
  onClose: () => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({
  isActive,
  onQRDetected,
  onClose
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanner, setScanner] = useState<QrScanner | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  useEffect(() => {
    if (isActive && videoRef.current) {
      console.log("Initializing QR scanner...");
      
      const qrScanner = new QrScanner(
        videoRef.current,
        (result) => {
          console.log("QR Code detected:", result.data);
          setScanResult(result.data);
          setIsScanning(false);
          onQRDetected(result.data);
          toast.success("QR Code scanned successfully!");
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
          preferredCamera: 'environment'
        }
      );

      setScanner(qrScanner);
      
      qrScanner.start()
        .then(() => {
          console.log("QR scanner started successfully");
          setIsScanning(true);
        })
        .catch((error) => {
          console.error("Error starting QR scanner:", error);
          toast.error("Could not access camera for QR scanning");
        });

      return () => {
        console.log("Cleaning up QR scanner");
        qrScanner.stop();
        qrScanner.destroy();
      };
    }
  }, [isActive, onQRDetected]);

  const handleRescan = () => {
    setScanResult(null);
    setIsScanning(true);
    if (scanner) {
      scanner.start().catch((error) => {
        console.error("Error restarting scanner:", error);
        toast.error("Could not restart scanner");
      });
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
        <div className="absolute bottom-20 left-0 right-0 text-center">
          {isScanning && !scanResult && (
            <div className="bg-black/60 backdrop-blur-sm mx-4 p-3 rounded-lg">
              <QrCode className="mx-auto mb-2 text-indomie-yellow" size={24} />
              <p className="text-white text-sm">Position QR code within the frame</p>
            </div>
          )}
          
          {scanResult && (
            <div className="bg-green-600/90 backdrop-blur-sm mx-4 p-3 rounded-lg">
              <CheckCircle className="mx-auto mb-2 text-white" size={24} />
              <p className="text-white text-sm font-medium">QR Code Scanned!</p>
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
          <p className="text-white/80 text-center text-sm">
            Hold your device steady and align the QR code
          </p>
        )}
      </div>
    </div>
  );
};
