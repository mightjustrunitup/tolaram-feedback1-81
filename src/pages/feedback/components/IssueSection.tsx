
import React from "react";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
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
    <div className="space-y-3 p-4 bg-white/80 rounded-md backdrop-blur-sm border border-gray-200">
      <Label className="text-base font-medium">Did you experience any of these issues?</Label>
      
      <div className="space-y-2">
        {PRODUCT_ISSUES.map((issue) => (
          <div key={issue} className="flex items-center space-x-2 bg-white rounded-md border border-gray-100 p-2 hover:bg-indomie-yellow/5 transition-colors">
            <Checkbox 
              id={issue.replace(/\s/g, '-')}
              checked={selectedIssues.includes(issue)}
              onCheckedChange={() => toggleIssue(issue)}
              className="border-indomie-red text-indomie-red"
            />
            <Label 
              htmlFor={issue.replace(/\s/g, '-')}
              className="text-sm md:text-base font-medium cursor-pointer flex items-center gap-2 w-full"
            >
              <AlertCircle className="h-4 w-4 text-amber-500" />
              {issue}
            </Label>
          </div>
        ))}
      </div>
      
      {selectedIssues.length > 0 && (
        <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md">
          <p className="text-sm text-amber-800 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Thank you for reporting: <span className="font-medium">{selectedIssues.join(", ")}</span>
          </p>
        </div>
      )}
    </div>
  );
};
