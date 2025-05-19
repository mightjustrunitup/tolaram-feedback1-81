
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
    
    // Test if RLS policies are working properly by attempting to access the feedback table
    const testAccessPermission = async () => {
      try {
        const { data, error } = await FeedbackService.testTableAccess();
        if (error) {
          console.error("Error accessing feedback table:", error);
          toast.error("Permission issue: Cannot access feedback data");
        } else {
          console.log("Successfully accessed feedback table:", data);
        }
      } catch (error) {
        console.error("Error testing table access:", error);
      }
    };
    
    // Run tests
    testCompleteFeedback();
    testAccessPermission();
  }, []);
  
  return <FeedbackPage />;
}
