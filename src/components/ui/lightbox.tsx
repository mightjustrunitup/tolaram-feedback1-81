
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, Download } from "lucide-react";

interface LightboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: string[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

export function Lightbox({
  open,
  onOpenChange,
  images,
  currentIndex,
  setCurrentIndex
}: LightboxProps) {
  const [zoomLevel, setZoomLevel] = useState(1);

  // Reset zoom level when changing images or closing/opening lightbox
  useEffect(() => {
    setZoomLevel(1);
  }, [currentIndex, open]);

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(images[currentIndex]);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `image_${currentIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  };

  if (images.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 max-w-[95vw] max-h-[95vh] w-fit h-fit border-none bg-transparent shadow-none">
        <div className="relative flex flex-col items-center justify-center bg-black/90 rounded-lg overflow-hidden w-full h-full">
          {/* Close button - top right */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-50 text-white opacity-70 hover:opacity-100 hover:bg-white/20"
            onClick={() => onOpenChange(false)}
          >
            <X size={24} />
          </Button>

          {/* Image counter - top center */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-40 text-white/70 text-sm">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Navigation buttons - sides */}
          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 z-40 text-white h-12 w-12 opacity-70 hover:opacity-100 hover:bg-white/20"
                onClick={handlePrevious}
              >
                <ChevronLeft size={32} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 z-40 text-white h-12 w-12 opacity-70 hover:opacity-100 hover:bg-white/20"
                onClick={handleNext}
              >
                <ChevronRight size={32} />
              </Button>
            </>
          )}

          {/* Image container */}
          <div className="flex-1 w-full h-full flex items-center justify-center p-8">
            <img
              src={images[currentIndex]}
              alt={`Image ${currentIndex + 1}`}
              style={{
                transform: `scale(${zoomLevel})`,
                transition: "transform 0.2s ease-in-out",
                maxHeight: "calc(95vh - 100px)",
                maxWidth: "calc(95vw - 100px)",
              }}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {/* Controls - bottom */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-40 flex items-center gap-2 bg-black/50 rounded-full px-4 py-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white opacity-70 hover:opacity-100 hover:bg-white/20 h-8 w-8"
              onClick={handleZoomOut}
            >
              <ZoomOut size={18} />
            </Button>
            <span className="text-white/70 text-xs w-8 text-center">{Math.round(zoomLevel * 100)}%</span>
            <Button
              variant="ghost"
              size="icon"
              className="text-white opacity-70 hover:opacity-100 hover:bg-white/20 h-8 w-8"
              onClick={handleZoomIn}
            >
              <ZoomIn size={18} />
            </Button>
            <div className="w-px h-5 bg-white/30 mx-1"></div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white opacity-70 hover:opacity-100 hover:bg-white/20 h-8 w-8"
              onClick={handleDownload}
            >
              <Download size={18} />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
