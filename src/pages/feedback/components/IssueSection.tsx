
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { PRODUCT_ISSUES } from "./types";
import { ImageUpload } from "@/components/feedback/components/ImageUpload";
import { Lightbox } from "@/components/ui/lightbox";

interface IssueSectionProps {
  selectedIssues: string[];
  setSelectedIssues: React.Dispatch<React.SetStateAction<string[]>>;
  uploadedImages?: string[];
  handleImageUpload?: (files: FileList) => void;
  handleImageRemove?: (index: number) => void;
}

export const IssueSection: React.FC<IssueSectionProps> = ({
  selectedIssues,
  setSelectedIssues,
  uploadedImages = [],
  handleImageUpload,
  handleImageRemove
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const toggleIssue = (issue: string) => {
    setSelectedIssues(prev => {
      if (prev.includes(issue)) {
        return prev.filter(i => i !== issue);
      } else {
        return [...prev, issue];
      }
    });
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="space-y-6 p-4 bg-white/70 rounded-md backdrop-blur-sm border border-gray-200">
      <h3 className="font-semibold text-lg text-indomie-dark">Issues Encountered</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {PRODUCT_ISSUES.map((issue) => (
          <div key={issue} className="flex items-center space-x-2 p-2 hover:bg-gray-50/80 rounded-md transition-colors">
            <Checkbox
              id={`issue-${issue}`}
              checked={selectedIssues.includes(issue)}
              onCheckedChange={() => toggleIssue(issue)}
            />
            <Label
              htmlFor={`issue-${issue}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {issue}
            </Label>
          </div>
        ))}
      </div>
      
      <div className="mt-4">
        <Label className="text-sm font-medium mb-2 block">Attach Images (Optional)</Label>
        
        {uploadedImages && uploadedImages.length > 0 ? (
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-2">Uploaded images (click to enlarge):</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
              {uploadedImages.map((src, index) => (
                <div 
                  key={index}
                  className="aspect-square rounded-md overflow-hidden border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => openLightbox(index)}
                >
                  <img 
                    src={src} 
                    alt={`Product issue ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500 italic">No images uploaded yet</div>
        )}
        
        <div className="mt-2">
          {handleImageUpload && handleImageRemove && (
            <ImageUpload 
              onImageUpload={handleImageUpload} 
              onImageRemove={handleImageRemove}
              uploadedImages={uploadedImages}
              onToggleCamera={() => {}}
              hasCamera={false}
            />
          )}
        </div>
      </div>
      
      {/* Image Lightbox */}
      {uploadedImages && uploadedImages.length > 0 && (
        <Lightbox
          open={lightboxOpen}
          onOpenChange={setLightboxOpen}
          images={uploadedImages}
          currentIndex={currentImageIndex}
          setCurrentIndex={setCurrentImageIndex}
        />
      )}
    </div>
  );
};
