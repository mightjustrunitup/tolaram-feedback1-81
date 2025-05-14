
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Paperclip, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

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
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && onImageUpload) {
      onImageUpload(e.target.files);
      // Reset the file input so the same file can be selected again
      e.target.value = '';
    }
  };

  // Define product issues if none are provided
  const displayedIssues = issues.length > 0 ? issues : [
    "Mislabelled products - allergies",
    "Unusual taste or odor",
    "Texture - too hard or soft",
    "Mold or spoilage",
    "Foreign elements"
  ];

  return (
    <>
      <div className="space-y-2 p-3 bg-white/80 rounded-md backdrop-blur-sm border border-gray-200">
        <Label className="text-sm font-medium flex justify-between">
          <span>Which issues did you experience with this product?</span>
          <span className="text-red-500">*</span>
        </Label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {displayedIssues.map((issue) => (
            <div 
              key={issue} 
              className={`flex items-center space-x-2 rounded-md p-1.5 transition-colors ${selectedIssues.includes(issue) ? 'bg-red-50 border border-red-100' : 'bg-white border border-gray-100 hover:bg-red-50/30'}`}
            >
              <Checkbox 
                id={issue.replace(/\s/g, '-')}
                checked={selectedIssues.includes(issue)}
                onCheckedChange={() => handleIssueToggle(issue)}
                className="border-indomie-red text-indomie-red"
              />
              <Label
                htmlFor={issue.replace(/\s/g, '-')}
                className="text-xs md:text-sm font-medium leading-none cursor-pointer"
              >
                {issue}
              </Label>
            </div>
          ))}
        </div>
        
        {errors.issue && (
          <p className="text-xs text-red-500 mt-1">{errors.issue}</p>
        )}
        
        {selectedIssues.length > 0 && (
          <div className="mt-1 p-1.5 bg-red-50 border border-red-100 rounded-md">
            <p className="text-xs text-red-800">
              Selected issues: <span className="font-medium">{selectedIssues.join(", ")}</span>
            </p>
          </div>
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
          
          {/* Image upload button */}
          <div className="absolute right-2 bottom-2">
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant="ghost" 
              size="sm"
              onClick={handleFileButtonClick}
              className="bg-transparent hover:bg-gray-100 flex items-center gap-2"
              title="Attach images to your feedback"
            >
              <Paperclip size={14} />
              <span className="text-xs">Attach image</span>
            </Button>
          </div>
        </div>
        
        {/* Display uploaded images with delete option */}
        {uploadedImages.length > 0 && (
          <div className="mt-1">
            <p className="text-xs text-gray-500 mb-1">Uploaded images:</p>
            <div className="flex flex-wrap gap-1">
              {uploadedImages.map((src, index) => (
                <div key={index} className="relative w-12 h-12 border rounded overflow-hidden group">
                  <img 
                    src={src} 
                    alt={`Uploaded image ${index + 1}`} 
                    className="w-full h-full object-cover" 
                  />
                  {onImageRemove && (
                    <button
                      type="button"
                      className="absolute top-0 right-0 bg-black/60 p-1 rounded-bl hidden group-hover:block"
                      onClick={() => onImageRemove(index)}
                      title="Remove image"
                    >
                      <X size={10} className="text-white" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
