
import React from "react";
import { Label } from "@/components/ui/label";
import { PRODUCT_ISSUES } from "./types";
import { Checkbox } from "@/components/ui/checkbox";

interface IssueSectionProps {
  selectedIssues: string[];
  setSelectedIssues: (issues: string[]) => void;
}

export const IssueSection: React.FC<IssueSectionProps> = ({
  selectedIssues,
  setSelectedIssues
}) => {
  const toggleIssue = (issue: string) => {
    if (selectedIssues.includes(issue)) {
      setSelectedIssues(selectedIssues.filter(i => i !== issue));
    } else {
      setSelectedIssues([...selectedIssues, issue]);
    }
  };

  return (
    <div className="space-y-2 p-3 bg-white/80 rounded-md backdrop-blur-sm border border-gray-200">
      <Label className="text-sm font-medium">Did you experience any of these issues?</Label>
      
      <div className="grid grid-cols-2 gap-1">
        {PRODUCT_ISSUES.map((issue) => (
          <div key={issue} className={`flex items-center space-x-2 rounded-md p-1.5 transition-colors ${selectedIssues.includes(issue) ? 'bg-gray-50 border border-gray-200' : 'bg-white border border-gray-100 hover:bg-gray-50/30'}`}>
            <Checkbox 
              id={issue.replace(/\s/g, '-')}
              checked={selectedIssues.includes(issue)}
              onCheckedChange={() => toggleIssue(issue)}
            />
            <Label 
              htmlFor={issue.replace(/\s/g, '-')}
              className="text-xs md:text-sm font-medium cursor-pointer w-full"
            >
              {issue}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};
