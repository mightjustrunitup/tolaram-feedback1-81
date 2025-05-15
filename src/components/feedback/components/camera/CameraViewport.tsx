
import React from "react";

interface CameraViewportProps {
  videoRef: React.RefObject<HTMLVideoElement>;
}

export const CameraViewport: React.FC<CameraViewportProps> = ({ videoRef }) => {
  return (
    <>
      <video 
        ref={videoRef} 
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay 
        playsInline 
        muted
      />
      
      {/* Video overlay */}
      <div className="absolute inset-0 pointer-events-none border-[1px] border-white/20 z-10">
        <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-indomie-yellow"></div>
        <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-indomie-yellow"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-indomie-yellow"></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-indomie-yellow"></div>
      </div>
    </>
  );
};
