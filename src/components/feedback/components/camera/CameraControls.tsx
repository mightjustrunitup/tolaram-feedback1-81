
import React from "react";
import { Button } from "@/components/ui/button";
import { Camera, FileImage } from "lucide-react";

interface CameraControlsProps {
  onCaptureClick: () => void;
  onGalleryClick: () => void;
  disabled: boolean;
}

export const CameraControls: React.FC<CameraControlsProps> = ({
  onCaptureClick,
  onGalleryClick,
  disabled
}) => {
  return (
    <div className="w-full p-4 bg-gradient-to-t from-black to-black/80">
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
