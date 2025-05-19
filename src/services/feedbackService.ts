import { get, post } from "@/lib/api";
import { supabase } from "@/integrations/supabase/client";
import { CompleteFeedback } from "@/pages/feedback/components/types";

// Define types for the service
export interface FeedbackSubmission {
  customerName?: string;
  location?: string;
  productId: string;
  variantId: string;
  issues: string[];
  comments?: string;
  imageFiles?: File[];
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface FeedbackResponse {
  id: string;
  submitted: boolean;
  timestamp: string;
  message: string;
}

/**
 * Service for feedback-related API operations
 */
export const FeedbackService = {
  /**
   * Test if we can access the feedback table (checks if RLS policies are working)
   */
  testTableAccess: async () => {
    return await supabase
      .from('feedback')
      .select('*')
      .limit(1);
  },

  /**
   * Upload images to Supabase storage and return their public URLs
   */
  uploadImages: async (files: File[], feedbackId: string): Promise<string[]> => {
    if (!files || files.length === 0) return [];
    
    console.log(`Uploading ${files.length} images for feedback ${feedbackId}`);
    const imageUrls: string[] = [];
    
    for (const file of files) {
      try {
        const filename = `${feedbackId}_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        
        const { data, error } = await supabase.storage
          .from('feedback-images')
          .upload(filename, file);
          
        if (error) {
          console.error("Error uploading file:", error);
          continue;
        }
        
        if (data) {
          // Get the public URL
          const { data: publicUrlData } = supabase.storage
            .from('feedback-images')
            .getPublicUrl(filename);
          
          if (publicUrlData && publicUrlData.publicUrl) {
            imageUrls.push(publicUrlData.publicUrl);
            console.log("Uploaded image URL:", publicUrlData.publicUrl);
          }
        }
      } catch (error) {
        console.error("Error in file upload process:", error);
      }
    }
    
    return imageUrls;
  },

  /**
   * Submit feedback to the backend
   */
  submitFeedback: async (data: FeedbackSubmission): Promise<FeedbackResponse> => {
    try {
      console.log("Submitting feedback (raw input):", {
        ...data,
        imageFiles: data.imageFiles ? `${data.imageFiles.length} files` : 'none'
      });
      
      // Step 1: Insert the main feedback record
      const { data: feedbackData, error: feedbackError } = await supabase
        .from('feedback')
        .insert({
          customer_name: data.customerName || null,
          location: data.location || null,
          product_id: data.productId,
          variant_id: data.variantId,
          comments: data.comments || null
        })
        .select('id, created_at')
        .single();
      
      if (feedbackError) {
        console.error('Supabase error during feedback submission:', feedbackError);
        return {
          id: '',
          submitted: false,
          timestamp: new Date().toISOString(),
          message: `Database error: ${feedbackError.message || 'Unknown error'}`
        };
      }
      
      const feedbackId = feedbackData.id;
      console.log("Feedback record created with ID:", feedbackId);
      
      // Step 2: Insert the issues
      if (data.issues && data.issues.length > 0) {
        const issueRecords = data.issues.map(issue => ({
          feedback_id: feedbackId,
          issue: issue
        }));
        
        const { error: issuesError } = await supabase
          .from('feedback_issues')
          .insert(issueRecords);
        
        if (issuesError) {
          console.error('Error inserting issues:', issuesError);
        }
      }
      
      // Step 3: Upload images and insert image URLs if any
      let imageUrls: string[] = [];
      if (data.imageFiles && data.imageFiles.length > 0) {
        imageUrls = await FeedbackService.uploadImages(data.imageFiles, feedbackId);
        
        console.log("Processed image URLs:", imageUrls);
        
        if (imageUrls.length > 0) {
          const imageRecords = imageUrls.map(url => ({
            feedback_id: feedbackId,
            image_url: url
          }));
          
          console.log("Image records to insert:", imageRecords);
          
          const { error: imagesError } = await supabase
            .from('feedback_images')
            .insert(imageRecords);
          
          if (imagesError) {
            console.error('Error inserting images:', imagesError);
          }
        }
      }
      
      // Step 4: Store coordinates data if available
      if (data.coordinates) {
        console.log("Coordinates data available:", data.coordinates);
        // We're storing this with the feedback record for now
        // If we need to store it separately later, we can update this
      }
      
      console.log("Feedback submission completed successfully");
      
      return {
        id: feedbackId,
        submitted: true,
        timestamp: feedbackData.created_at,
        message: "Feedback submitted successfully"
      };
    } catch (error) {
      console.error('Error submitting feedback:', error);
      let errorMessage = "Failed to submit feedback";
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = (error as { message: string }).message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      return {
        id: '',
        submitted: false,
        timestamp: new Date().toISOString(),
        message: errorMessage
      };
    }
  },
  
  /**
   * Submit customer contact information for rewards program
   */
  submitCustomerRewards: async (data: {
    customerName?: string;
    phone: string;
    feedbackId?: string;
    location?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  }): Promise<{ success: boolean; message: string }> => {
    try {
      console.log("Submitting customer rewards data:", data);
      
      const { error } = await supabase
        .from('customer_rewards')
        .insert({
          customer_name: data.customerName || null,
          phone: data.phone,
          feedback_id: data.feedbackId || null,
          location: data.location || null,
          coordinates: data.coordinates || null
        });
      
      if (error) {
        console.error('Error submitting customer rewards:', error);
        return {
          success: false,
          message: `Failed to join rewards program: ${error.message}`
        };
      }
      
      return {
        success: true,
        message: "Successfully joined rewards program"
      };
    } catch (error) {
      console.error('Error in customer rewards submission:', error);
      let errorMessage = "Failed to join rewards program";
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = (error as { message: string }).message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        message: errorMessage
      };
    }
  },

  /**
   * Get available products from the backend
   */
  getProducts: () => {
    return get<any[]>('/products');
  },

  /**
   * Get product variants by product ID
   */
  getProductVariants: (productId: string) => {
    return get<any[]>(`/products/${productId}/variants`);
  },
  
  /**
   * Get complete feedback data using the view
   * This uses the complete_feedback view directly without RPC calls
   */
  getCompleteFeedback: async (): Promise<CompleteFeedback[]> => {
    try {
      // We're directly using the view that was created in the database
      const { data, error } = await supabase
        .from('complete_feedback')
        .select('*') as { data: CompleteFeedback[] | null, error: any };
        
      if (error) {
        console.error('Error fetching complete feedback:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getCompleteFeedback:', error);
      throw error;
    }
  }
};
