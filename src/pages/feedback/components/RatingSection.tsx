
import React from "react";
import { StarRating } from "@/components/ui/star-rating";

interface RatingSectionProps {
  ratings: {
    staffFriendliness: number;
    cleanliness: number;
    productAvailability: number;
    overallExperience: number;
  };
  handleRatingChange: (name: string, value: number) => void;
}

export const RatingSection: React.FC<RatingSectionProps> = ({
  ratings,
  handleRatingChange
}) => {
  return (
    <div className="space-y-6 p-4 bg-white/70 rounded-md backdrop-blur-sm border border-gray-200">
      <h3 className="font-semibold text-lg mb-4 text-indomie-dark">Rate Your Experience</h3>
      
      <div className="space-y-4">
        <div className="p-3 hover:bg-gray-50/70 rounded-md transition-colors">
          <StarRating
            label={`Staff Friendliness`}
            value={ratings.staffFriendliness}
            onChange={(value) => handleRatingChange("staffFriendliness", value)}
            max={5}
            color="text-indomie-yellow"
            size="lg"
            showValue
          />
        </div>
        
        <div className="p-3 hover:bg-gray-50/70 rounded-md transition-colors">
          <StarRating
            label={`Cleanliness`}
            value={ratings.cleanliness}
            onChange={(value) => handleRatingChange("cleanliness", value)}
            max={5}
            color="text-indomie-yellow"
            size="lg"
            showValue
          />
        </div>
        
        <div className="p-3 hover:bg-gray-50/70 rounded-md transition-colors">
          <StarRating
            label={`Product Availability`}
            value={ratings.productAvailability}
            onChange={(value) => handleRatingChange("productAvailability", value)}
            max={5}
            color="text-indomie-yellow"
            size="lg"
            showValue
          />
        </div>
        
        <div className="p-3 hover:bg-gray-50/70 rounded-md transition-colors">
          <StarRating
            label={`Overall Experience`}
            value={ratings.overallExperience}
            onChange={(value) => handleRatingChange("overallExperience", value)}
            max={5}
            color="text-indomie-yellow"
            size="lg"
            showValue
          />
        </div>
      </div>
    </div>
  );
};
