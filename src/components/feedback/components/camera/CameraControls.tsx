
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Camera, FileImage, QrCode, ChevronUp, ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface CameraControlsProps {
  onCaptureClick: () => void;
  onGalleryClick: () => void;
  onQRScanClick?: () => void;
  disabled: boolean;
}

export const CameraControls: React.FC<CameraControlsProps> = ({
  onCaptureClick,
  onGalleryClick,
  onQRScanClick,
  disabled
}) => {
  const isMobile = useIsMobile();
  const [showQROptions, setShowQROptions] = useState(false);

  const toggleQROptions = () => {
    setShowQROptions(!showQROptions);
  };

  return (
    <div className="w-full p-4 bg-gradient-to-t from-black to-black/80">
      {/* QR Scan Options - Show only on mobile */}
      {isMobile && showQROptions && onQRScanClick && (
        <div className="mb-4 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
          <div className="flex flex-col gap-2">
            <p className="text-white text-sm font-medium mb-2">Scan Options</p>
            <Button
              type="button"
              variant="outline"
              onClick={onQRScanClick}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              disabled={disabled}
            >
              <QrCode size={16} className="mr-2" />
              Scan Product QR Code
            </Button>
            <p className="text-white/70 text-xs">
              Scan the QR code on your product to prevent duplicate submissions
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center gap-4 w-full">
        <Button
          type="button"
          variant="outline"
          onClick={onGalleryClick}
          className="flex-1 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
        >
          <FileImage size={16} className="mr-2" />
          Select Photos
        </Button>
        
        {/* QR Toggle Button - Mobile only */}
        {isMobile && onQRScanClick && (
          <Button
            type="button"
            variant="outline"
            onClick={toggleQROptions}
            className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 px-3"
          >
            <QrCode size={16} />
            {showQROptions ? <ChevronDown size={14} className="ml-1" /> : <ChevronUp size={14} className="ml-1" />}
          </Button>
        )}
        
        <Button 
          type="button" 
          onClick={onCaptureClick}
          className="flex-1 bg-indomie-yellow text-black hover:bg-indomie-yellow/90 font-medium"
          disabled={disabled}
        >
          <Camera size={16} className="mr-2" />
          Capture
        </Button>
      </div>
    </div>
  );
};
