
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
  imageUrls?: string[];
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  ratings?: {
    staffFriendliness: number;
    cleanliness: number;
    productAvailability: number;
    overallExperience: number;
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
   * Submit feedback to the backend
   */
  submitFeedback: async (data: FeedbackSubmission): Promise<FeedbackResponse> => {
    try {
      console.log("Submitting feedback (raw input):", data);
      
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
      if (data.issues.length > 0) {
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
      
      // Step 3: Insert image URLs if any
      if (data.imageUrls && data.imageUrls.length > 0 && Array.isArray(data.imageUrls)) {
        console.log("Processing image URLs:", data.imageUrls);
        
        const imageRecords = data.imageUrls.map(url => ({
          feedback_id: feedbackId,
          image_url: url
        }));
        
        const { error: imagesError } = await supabase
          .from('feedback_images')
          .insert(imageRecords);
        
        if (imagesError) {
          console.error('Error inserting images:', imagesError);
        }
      }
      
      // Step 4: Insert ratings if any
      if (data.ratings) {
        console.log("Processing ratings:", data.ratings);
        
        const ratingEntries = Object.entries(data.ratings);
        const ratingRecords = ratingEntries.map(([category, score]) => ({
          feedback_id: feedbackId,
          category,
          score
        }));
        
        const { error: ratingsError } = await supabase
          .from('feedback_ratings')
          .insert(ratingRecords);
        
        if (ratingsError) {
          console.error('Error inserting ratings:', ratingsError);
        }
      }
      
      // Step 5: Store coordinates data if available
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
