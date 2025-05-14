
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
  imageUrls?: string[]; // Added image URLs field
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
      console.log("Submitting feedback:", data);
      
      // Clear any undefined values to avoid RLS issues
      const submissionData = {
        customer_name: data.customerName || null,
        location: data.location || null,
        product_id: data.productId,
        variant_id: data.variantId,
        issues: data.issues,
        comments: data.comments || null,
        image_urls: data.imageUrls || null // Added image_urls field
      };
      
      console.log("Cleaned submission data:", submissionData);
      
      const { data: insertedData, error } = await supabase
        .from('feedback')
        .insert(submissionData)
        .select('id, created_at')
        .single();
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
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
      return {
        id: '',
        submitted: false,
        timestamp: new Date().toISOString(),
        message: error instanceof Error ? error.message : "Failed to submit feedback"
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
