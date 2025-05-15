
import React from "react";
import { Button } from "@/components/ui/button";
import { Camera, FileImage } from "lucide-react";

interface CameraErrorStateProps {
  onSelectGallery: () => void;
}

export const CameraErrorState: React.FC<CameraErrorStateProps> = ({ onSelectGallery }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-20 p-6">
      <Camera className="h-14 w-14 text-indomie-yellow/70 mb-3" />
      <p className="text-white text-center font-medium">Camera access denied or not available.</p>
      <Button 
        onClick={onSelectGallery} 
        variant="outline" 
        className="mt-4 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
      >
        <FileImage size={16} className="mr-2" />
        Select from Gallery
      </Button>
    </div>
  );
};
