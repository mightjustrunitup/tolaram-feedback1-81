
import React from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Barcode } from "lucide-react";

interface CameraControlsProps {
  onCaptureClick: () => void;
  onGalleryClick: () => void;
  onBarcodeScanClick?: () => void;
  disabled?: boolean;
}

export const CameraControls: React.FC<CameraControlsProps> = ({
  onCaptureClick,
  onGalleryClick,
  onBarcodeScanClick,
  disabled = false
}) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
      <div className="flex justify-center items-center gap-4">
        {/* Gallery button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onGalleryClick}
          disabled={disabled}
          className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 disabled:opacity-50"
        >
          <Upload size={20} />
        </Button>

        {/* Capture button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onCaptureClick}
          disabled={disabled}
          className="w-16 h-16 rounded-full bg-white text-black hover:bg-white/90 disabled:opacity-50"
        >
          <Camera size={24} />
        </Button>

        {/* Barcode scan button */}
        {onBarcodeScanClick && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBarcodeScanClick}
            disabled={disabled}
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 disabled:opacity-50"
          >
            <Barcode size={20} />
          </Button>
        )}
      </div>
      
      <div className="text-center mt-2">
        <p className="text-white/80 text-xs">
          {onBarcodeScanClick ? "Tap camera to capture or barcode to scan" : "Tap to capture or upload from gallery"}
        </p>
      </div>
    </div>
  );
};
