
import { FeedbackPage } from "@/pages/feedback/FeedbackPage";
import { useEffect } from "react";
import { FeedbackService } from "@/services/feedbackService";
import { toast } from "sonner";

export default function Feedback() {
  useEffect(() => {
    // Test the complete_feedback view to ensure it's working properly
    const testCompleteFeedback = async () => {
      try {
        const feedbackData = await FeedbackService.getCompleteFeedback();
        console.log("Complete feedback data:", feedbackData);
        
        // Check if there's valid data and log detailed information for debugging
        if (feedbackData.length > 0) {
          toast.success(`Successfully loaded ${feedbackData.length} feedback entries`);
          
          // Log details of first feedback entry to check if images and ratings are loaded
          const firstEntry = feedbackData[0];
          console.log("First feedback details:", {
            id: firstEntry.id,
            ratings: firstEntry.ratings,
            images: firstEntry.images,
            issues: firstEntry.issues
          });
        } else {
          console.log("No feedback entries found yet");
        }
      } catch (error) {
        console.error("Error loading complete feedback:", error);
        toast.error("Failed to load feedback data");
      }
    };
    
    // Test the view
    testCompleteFeedback();
  }, []);
  
  return <FeedbackPage />;
}
