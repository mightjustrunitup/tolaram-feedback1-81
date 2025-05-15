
import React from "react";
import { Loader2 } from "lucide-react";

export const CameraLoadingState: React.FC = () => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-20">
      <div className="relative">
        <Loader2 className="h-12 w-12 animate-spin text-indomie-yellow mb-2" />
        <div className="absolute inset-0 h-12 w-12 animate-pulse bg-indomie-yellow/20 rounded-full"></div>
      </div>
      <span className="text-white font-medium mt-3">Activating camera...</span>
      <p className="text-white/70 text-sm mt-1 max-w-[220px] text-center">Please allow camera access when prompted by your browser</p>
    </div>
  );
};
