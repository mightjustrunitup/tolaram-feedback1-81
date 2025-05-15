
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface IssueCheckboxesProps {
  issues: string[];
  selectedIssues: string[];
  handleIssueToggle: (issue: string) => void;
}

export const IssueCheckboxes: React.FC<IssueCheckboxesProps> = ({
  issues,
  selectedIssues,
  handleIssueToggle,
}) => {
  // Define product issues if none are provided
  const displayedIssues = issues.length > 0 ? issues : [
    "Mislabelled products",
    "Unusual taste or odor",
    "Texture - too hard or soft",
    "Mold or spoilage",
    "Foreign elements"
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
      {displayedIssues.map((issue) => (
        <div 
          key={issue} 
          className={`flex items-center space-x-2 rounded-md p-1.5 transition-colors ${selectedIssues.includes(issue) ? 'bg-gray-50 border border-gray-200' : 'bg-white border border-gray-100 hover:bg-gray-50/30'}`}
        >
          <Checkbox 
            id={issue.replace(/\s/g, '-')}
            checked={selectedIssues.includes(issue)}
            onCheckedChange={() => handleIssueToggle(issue)}
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
  );
};
