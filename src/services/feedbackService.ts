
import { get, post } from "@/lib/api";
import { supabase } from "@/integrations/supabase/client";

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
      
      // Prepare data for the new feedback table
      const submissionPayload = {
        customer_name: data.customerName || null,
        location: data.location || null,
        product_id: data.productId,
        variant_id: data.variantId,
        issues: data.issues,
        comments: data.comments || null,
        // Add coordinates if available
        latitude: data.coordinates?.latitude || null,
        longitude: data.coordinates?.longitude || null,
        // Add image URLs if available
        image_urls: data.imageUrls || null
      };
      
      console.log("Submitting to feedback table:", submissionPayload);
      
      // Insert into the new feedback table
      const { data: insertedData, error } = await supabase
        .from('feedback')
        .insert(submissionPayload)
        .select('id, created_at')
        .single();
      
      if (error) {
        console.error('Supabase error during submission:', error);
        
        return {
          id: '',
          submitted: false,
          timestamp: new Date().toISOString(),
          message: `Database error: ${error.message || 'Unknown error'}`
        };
      }
      
      console.log("Feedback submitted successfully:", insertedData);
      
      return {
        id: insertedData.id,
        submitted: true,
        timestamp: insertedData.created_at,
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
  }
};
