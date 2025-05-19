
import { FeedbackPage } from "@/pages/feedback/FeedbackPage";
import { useEffect } from "react";
import { FeedbackService } from "@/services/feedbackService";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function Feedback() {
  useEffect(() => {
    // Check if the storage bucket exists
    const checkStorageBucket = async () => {
      try {
        const { data: buckets, error: listError } = await supabase.storage.listBuckets();
        
        if (listError) {
          console.error("Error checking buckets:", listError);
          return;
        }
        
        const bucketExists = buckets.some(bucket => bucket.name === 'feedback-images');
        
        if (bucketExists) {
          console.log("Feedback images bucket exists");
          
          // Test the bucket by listing its contents
          const { data: objects, error: objectsError } = await supabase.storage
            .from('feedback-images')
            .list();
            
          if (objectsError) {
            console.error("Error listing objects in bucket:", objectsError);
          } else {
            console.log(`Found ${objects.length} objects in feedback-images bucket`);
          }
        } else {
          console.error("Feedback images bucket does not exist!");
          toast.error("Storage bucket configuration issue");
        }
      } catch (error) {
        console.error("Error with storage bucket setup:", error);
      }
    };
    
    // Test the complete_feedback view to ensure it's working properly
    const testCompleteFeedback = async () => {
      try {
        const feedbackData = await FeedbackService.getCompleteFeedback();
        console.log("Complete feedback data:", feedbackData);
        
        // Check if there's valid data and log detailed information for debugging
        if (feedbackData.length > 0) {
          toast.success(`Successfully loaded ${feedbackData.length} feedback entries`);
          
          // Log details of first feedback entry to check if images are loaded
          const firstEntry = feedbackData[0];
          console.log("First feedback details:", {
            id: firstEntry.id,
            images: firstEntry.images,
            issues: firstEntry.issues
          });
          
          // Specifically check if images are properly loaded
          if (!firstEntry.images || firstEntry.images.length === 0) {
            console.log("Warning: No images found in the loaded feedback");
          } else {
            console.log("Images found:", firstEntry.images);
          }
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
    checkStorageBucket();
    testCompleteFeedback();
    testAccessPermission();
  }, []);
  
  return <FeedbackPage />;
}
