import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip, X, Camera, Loader2, Maximize2, Minimize2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ImageUploadProps {
  onImageUpload: (files: FileList) => void;
  onImageRemove?: (index: number) => void;
  uploadedImages: string[];
  onToggleCamera?: () => void;
  hasCamera: boolean;
  isUploading?: boolean;
  showFullSizePreview?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  onImageRemove,
  uploadedImages,
  onToggleCamera,
  hasCamera,
  isUploading = false,
  showFullSizePreview = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  const [isAttaching, setIsAttaching] = useState(false);
  const [expandedImageIndex, setExpandedImageIndex] = useState<number | null>(null);

  const handleFileButtonClick = () => {
    setIsAttaching(true);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImageUpload(e.target.files);
      // Reset the file input so the same file can be selected again
      e.target.value = '';
      // Set isAttaching to false to hide the input on mobile after file selection
      setIsAttaching(false);
    } else {
      // If no files were selected, reset the attaching state
      setIsAttaching(false);
    }
  };

  const handleCancelAttach = () => {
    setIsAttaching(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleImageExpand = (index: number) => {
    if (expandedImageIndex === index) {
      setExpandedImageIndex(null);
    } else {
      setExpandedImageIndex(index);
    }
  };

  return (
    <>
      {/* Image upload buttons */}
      <div className="absolute right-2 bottom-2 flex items-center gap-1">
        <input 
          type="file" 
          accept="image/*" 
          multiple 
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
          onClick={(e) => isAttaching ? e.stopPropagation() : null}
          disabled={isUploading}
        />
        
        {isMobile && isAttaching && (
          <Button
            type="button"
            variant="ghost" 
            size="sm"
            onClick={handleCancelAttach}
            className="bg-gray-100 hover:bg-gray-200 flex items-center"
            title="Cancel image attachment"
            disabled={isUploading}
          >
            <X size={14} />
          </Button>
        )}
        
        {/* Only show Camera button on mobile */}
        {isMobile && hasCamera && onToggleCamera && (
          <Button
            type="button"
            variant="ghost" 
            size="sm"
            onClick={onToggleCamera}
            className="bg-transparent hover:bg-gray-100 flex items-center"
            title="Take a photo"
            disabled={isUploading}
          >
            <Camera size={14} />
          </Button>
        )}
        
        {/* Hide attach button on mobile, show on desktop */}
        {!isMobile && (
          <Button
            type="button"
            variant="ghost" 
            size="sm"
            onClick={handleFileButtonClick}
            className="bg-transparent hover:bg-gray-100 flex items-center"
            title="Attach images to your feedback"
            disabled={isUploading}
          >
            {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Paperclip size={14} />}
          </Button>
        )}
      </div>
      
      {/* Display uploaded images with delete option */}
      {uploadedImages.length > 0 && (
        <div className="mt-1">
          <p className="text-xs text-gray-500 mb-1">Uploaded images:</p>
          <div className="flex flex-wrap gap-2">
            {uploadedImages.map((src, index) => (
              <div 
                key={index} 
                className={`relative border rounded overflow-hidden group transition-all duration-300 ${
                  expandedImageIndex === index ? "w-full h-60" : "w-16 h-16"
                }`}
                onClick={() => showFullSizePreview && toggleImageExpand(index)}
              >
                <img 
                  src={src} 
                  alt={`Uploaded image ${index + 1}`} 
                  className={`w-full h-full ${
                    expandedImageIndex === index ? "object-contain" : "object-cover"
                  }`}
                />
                {onImageRemove && !isUploading && (
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-black/60 p-1 rounded-bl md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      onImageRemove(index);
                    }}
                    title="Remove image"
                    disabled={isUploading}
                  >
                    <X size={12} className="text-white" />
                  </button>
                )}
                {showFullSizePreview && (
                  <button
                    type="button"
                    className="absolute bottom-0 right-0 bg-black/60 p-1 rounded-tl md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleImageExpand(index);
                    }}
                    title={expandedImageIndex === index ? "Minimize" : "Expand"}
                  >
                    {expandedImageIndex === index ? (
                      <Minimize2 size={12} className="text-white" />
                    ) : (
                      <Maximize2 size={12} className="text-white" />
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
