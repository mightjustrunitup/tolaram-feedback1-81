
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
  onToggleCamera
}) => {
  const isMobile = useIsMobile();
  const [hasCamera, setHasCamera] = useState(false);

  // Check if device has camera capability
  useEffect(() => {
    if (isMobile && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setHasCamera(true);
    }
  }, [isMobile]);

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
          />
          
          {onImageUpload && (
            <ImageUpload
              onImageUpload={onImageUpload}
              onImageRemove={onImageRemove}
              uploadedImages={uploadedImages}
              onToggleCamera={onToggleCamera}
              hasCamera={hasCamera}
            />
          )}
        </div>
      </div>
      
      {/* Camera Component */}
      {onCameraCapture && onToggleCamera && (
        <CameraCapture
          isCameraActive={!!isCameraActive}
          onToggleCamera={onToggleCamera}
          onCameraCapture={onCameraCapture}
        />
      )}
    </>
  );
};
