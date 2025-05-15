
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Paperclip, X, Camera } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ImageUploadProps {
  onImageUpload: (files: FileList) => void;
  onImageRemove?: (index: number) => void;
  uploadedImages: string[];
  onToggleCamera?: () => void;
  hasCamera: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  onImageRemove,
  uploadedImages,
  onToggleCamera,
  hasCamera
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  const [isAttaching, setIsAttaching] = useState(false);

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
        />
        
        {isMobile && isAttaching && (
          <Button
            type="button"
            variant="ghost" 
            size="sm"
            onClick={handleCancelAttach}
            className="bg-gray-100 hover:bg-gray-200 flex items-center"
            title="Cancel image attachment"
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
          >
            <Camera size={14} />
          </Button>
        )}
        
        {/* Only show Attach button on web (non-mobile) */}
        {!isMobile && (
          <Button
            type="button"
            variant="ghost" 
            size="sm"
            onClick={handleFileButtonClick}
            className="bg-transparent hover:bg-gray-100 flex items-center"
            title="Attach images to your feedback"
          >
            <Paperclip size={14} />
          </Button>
        )}
      </div>
      
      {/* Display uploaded images with delete option */}
      {uploadedImages.length > 0 && (
        <div className="mt-1">
          <p className="text-xs text-gray-500 mb-1">Uploaded images:</p>
          <div className="flex flex-wrap gap-2">
            {uploadedImages.map((src, index) => (
              <div key={index} className="relative w-16 h-16 border rounded overflow-hidden group">
                <img 
                  src={src} 
                  alt={`Uploaded image ${index + 1}`} 
                  className="w-full h-full object-cover" 
                />
                {onImageRemove && (
                  <button
                    type="button"
                    className="absolute top-0 right-0 bg-black/60 p-1 rounded-bl md:hidden md:group-hover:block"
                    onClick={() => onImageRemove(index)}
                    title="Remove image"
                  >
                    <X size={12} className="text-white" />
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
