
import React from "react";
import { Loader2 } from "lucide-react";

export const CameraLoadingState: React.FC = () => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm z-20">
      <Loader2 className="h-10 w-10 animate-spin text-indomie-yellow mb-2" />
      <span className="text-white font-medium">Activating camera...</span>
    </div>
  );
};
