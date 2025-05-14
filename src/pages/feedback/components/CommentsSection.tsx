
import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CommentsSectionProps {
  comments: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({
  comments,
  handleInputChange
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="comments">Additional Comments</Label>
      <Textarea
        id="comments"
        name="comments"
        placeholder={`Please share any additional feedback, issues, or suggestions...`}
        className="min-h-[120px]"
        value={comments}
        onChange={handleInputChange}
        maxWords={100}
        showWordCount={true}
      />
    </div>
  );
};
