
import React from "react";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import { PRODUCT_ISSUES } from "./types";

interface IssueSectionProps {
  selectedIssue: string;
  setSelectedIssue: (issue: string) => void;
}

export const IssueSection: React.FC<IssueSectionProps> = ({
  selectedIssue,
  setSelectedIssue
}) => {
  return (
    <div className="space-y-3 p-4 bg-white/80 rounded-md backdrop-blur-sm border border-gray-200">
      <Label className="text-base font-medium">Did you experience any of these issues?</Label>
      
      <Select 
        value={selectedIssue} 
        onValueChange={setSelectedIssue}
      >
        <SelectTrigger className="w-full bg-white">
          <SelectValue placeholder="Select any issues you experienced..." />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectGroup>
            <SelectLabel className="font-semibold text-indomie-red">Common Product Issues</SelectLabel>
            {PRODUCT_ISSUES.map((issue) => (
              <SelectItem 
                key={issue} 
                value={issue}
                className="flex items-center gap-2 focus:bg-indomie-yellow/10 hover:bg-indomie-yellow/5 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <span>{issue}</span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      
      {selectedIssue && (
        <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md">
          <p className="text-sm text-amber-800 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Thank you for reporting: <span className="font-medium">{selectedIssue}</span>
          </p>
        </div>
      )}
    </div>
  );
};
