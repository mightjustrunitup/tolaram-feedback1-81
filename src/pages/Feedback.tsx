
import { FeedbackPage } from "@/pages/feedback/FeedbackPage";
import { useEffect } from "react";
import { FeedbackService } from "@/services/feedbackService";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function Feedback() {
  useEffect(() => {
    // Create the storage bucket if it doesn't exist
    const createStorageBucket = async () => {
      try {
        // Check if the bucket exists
        const { data: buckets, error: listError } = await supabase.storage.listBuckets();
        
        if (listError) {
          console.error("Error checking buckets:", listError);
          return;
        }
        
        const bucketExists = buckets.some(bucket => bucket.name === 'feedback-images');
        
        if (!bucketExists) {
          console.log("Creating feedback-images storage bucket");
          const { data, error } = await supabase.storage.createBucket('feedback-images', {
            public: true,
            fileSizeLimit: 5242880, // 5MB
          });
          
          if (error) {
            console.error("Error creating storage bucket:", error);
          } else {
            console.log("Storage bucket created successfully:", data);
          }
        } else {
          console.log("Feedback images bucket already exists");
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
          
          // Log details of first feedback entry to check if images and ratings are loaded
          const firstEntry = feedbackData[0];
          console.log("First feedback details:", {
            id: firstEntry.id,
            ratings: firstEntry.ratings,
            images: firstEntry.images,
            issues: firstEntry.issues
          });
          
          // Specifically check if images and ratings are properly loaded
          if (!firstEntry.images || firstEntry.images.length === 0) {
            console.log("Warning: No images found in the loaded feedback");
          } else {
            console.log("Images found:", firstEntry.images);
          }
          
          if (!firstEntry.ratings || Object.keys(firstEntry.ratings).length === 0) {
            console.log("Warning: No ratings found in the loaded feedback");
          } else {
            console.log("Ratings found:", firstEntry.ratings);
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
    createStorageBucket();
    testCompleteFeedback();
    testAccessPermission();
  }, []);
  
  return <FeedbackPage />;
}
