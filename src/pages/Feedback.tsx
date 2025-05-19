
import { FeedbackPage } from "@/pages/feedback/FeedbackPage";
import { useEffect } from "react";
import { FeedbackService } from "@/services/feedbackService";
import { toast } from "sonner";

export default function Feedback() {
  useEffect(() => {
    // You can optionally test the complete_feedback view here
    const testCompleteFeedback = async () => {
      try {
        const feedbackData = await FeedbackService.getCompleteFeedback();
        console.log("Complete feedback data:", feedbackData);
      } catch (error) {
        console.error("Error loading complete feedback:", error);
      }
    };
    
    // Uncomment to test
    // testCompleteFeedback();
  }, []);
  
  return <FeedbackPage />;
}
