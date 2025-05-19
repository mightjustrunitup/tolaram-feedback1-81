
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
        if (feedbackData.length > 0) {
          toast.success(`Successfully loaded ${feedbackData.length} feedback entries`);
        } else {
          console.log("No feedback entries found yet");
        }
      } catch (error) {
        console.error("Error loading complete feedback:", error);
        toast.error("Failed to load feedback data");
      }
    };
    
    // Uncomment to test the view
    testCompleteFeedback();
  }, []);
  
  return <FeedbackPage />;
}
