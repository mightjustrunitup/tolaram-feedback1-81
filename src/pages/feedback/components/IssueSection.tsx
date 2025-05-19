
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { PRODUCT_ISSUES } from "./types";
import { ImageUpload } from "@/components/feedback/components/ImageUpload";

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
  const toggleIssue = (issue: string) => {
    setSelectedIssues(prev => {
      if (prev.includes(issue)) {
        return prev.filter(i => i !== issue);
      } else {
        return [...prev, issue];
      }
    });
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
    </div>
  );
};
