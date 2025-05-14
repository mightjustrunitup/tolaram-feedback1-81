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
   * Submit feedback to Supabase
   */
  submitFeedback: async (data: FeedbackSubmission): Promise<FeedbackResponse> => {
    try {
      console.log("Submitting feedback (raw input):", data);
      
      // Prepare data for Supabase, temporarily excluding image_urls
      // until the database schema is updated.
      const submissionPayload: {
        customer_name: string | null;
        location: string | null;
        product_id: string;
        variant_id: string;
        issues: string[];
        comments: string | null;
        // image_urls would go here if the column existed and we were sending them
      } = {
        customer_name: data.customerName || null,
        location: data.location || null,
        product_id: data.productId,
        variant_id: data.variantId,
        issues: data.issues,
        comments: data.comments || null,
      };
      
      // IMPORTANT: Image URLs are not being sent in this temporary fix.
      // To save images, add an 'image_urls' column (type text[]) to your 'feedback' table in Supabase,
      // and then update this code to include:
      // if (data.imageUrls && data.imageUrls.length > 0) {
      //   (submissionPayload as any).image_urls = data.imageUrls;
      // }
      
      console.log("Cleaned submission data (image_urls temporarily excluded):", submissionPayload);
      
      const { data: insertedData, error } = await supabase
        .from('feedback')
        .insert(submissionPayload) // Sending payload without image_urls
        .select('id, created_at')
        .single();
      
      if (error) {
        console.error('Supabase error during submission:', error);
        // Re-throw the error to be caught by the generic error handler below
        throw error;
      }
      
      console.log("Feedback submitted successfully (without images):", insertedData);
      
      return {
        id: insertedData.id,
        submitted: true,
        timestamp: insertedData.created_at,
        message: "Feedback submitted successfully (images not saved)"
      };
    } catch (error) {
      console.error('Error submitting feedback:', error);
      // Construct a more specific message if it's a known Supabase error structure
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
