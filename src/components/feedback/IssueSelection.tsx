
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";
import { IssueCheckboxes } from "./components/IssueCheckboxes";
import { CameraCapture } from "./components/CameraCapture";
import { ImageUpload } from "./components/ImageUpload";

interface IssueSelectionProps {
  issues: string[];
  selectedIssues: string[];
  comments: string;
  handleIssueToggle: (issue: string) => void;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  errors: { [key: string]: string };
  uploadedImages?: string[];
  onImageUpload?: (files: FileList) => void;
  onImageRemove?: (index: number) => void;
  isCameraActive?: boolean;
  onCameraCapture?: (imageData: string) => void;
  onToggleCamera?: () => void;
  isUploading?: boolean;
}

export const IssueSelection: React.FC<IssueSelectionProps> = ({
  issues,
  selectedIssues,
  comments,
  handleIssueToggle,
  onInputChange,
  errors,
  uploadedImages = [],
  onImageUpload,
  onImageRemove,
  isCameraActive = false,
  onCameraCapture,
  onToggleCamera,
  isUploading = false
}) => {
  const isMobile = useIsMobile();
  const [hasCamera, setHasCamera] = useState(false);
  const [imagePreviewMode, setImagePreviewMode] = useState<"grid" | "carousel">("grid");

  // Check if device has camera capability
  useEffect(() => {
    const checkCameraCapability = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setHasCamera(false);
          return;
        }
        
        // Just check if we can get camera access without actually using it
        await navigator.mediaDevices.getUserMedia({ video: true });
        console.log("Camera is available");
        setHasCamera(true);
      } catch (error) {
        console.log("Camera not available or permission denied:", error);
        setHasCamera(false);
      }
    };
    
    checkCameraCapability();
  }, []);

  return (
    <>
      <div className="space-y-2 p-3 bg-white/80 rounded-md backdrop-blur-sm border border-gray-200">
        <Label className="text-sm font-medium flex justify-between">
          <span>Which issues did you experience with this product?</span>
          <span className="text-red-500">*</span>
        </Label>
        
        <IssueCheckboxes 
          issues={issues}
          selectedIssues={selectedIssues}
          handleIssueToggle={handleIssueToggle}
        />
        
        {errors.issue && (
          <p className="text-xs text-red-500 mt-1">{errors.issue}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="comments" className="text-sm">Additional Comments</Label>
        <div className="relative">
          <Textarea
            id="comments"
            name="comments"
            placeholder="Please share any additional details about the issues you experienced..."
            className="min-h-[100px] text-sm"
            value={comments}
            onChange={onInputChange}
            disabled={isUploading}
          />
          
          {onImageUpload && (
            <ImageUpload
              onImageUpload={onImageUpload}
              onImageRemove={onImageRemove}
              uploadedImages={uploadedImages}
              onToggleCamera={onToggleCamera}
              hasCamera={hasCamera}
              isUploading={isUploading}
              showFullSizePreview={true}
            />
          )}
        </div>
      </div>
      
      {/* Camera Component */}
      {isCameraActive && onCameraCapture && onToggleCamera && onImageUpload && (
        <CameraCapture
          isCameraActive={isCameraActive}
          onToggleCamera={onToggleCamera}
          onCameraCapture={onCameraCapture}
          onImageUpload={onImageUpload}
        />
      )}
    </>
  );
};
