
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
   * Submit feedback to the backend - using contacts table as placeholder until feedback table types are generated
   */
  submitFeedback: async (data: FeedbackSubmission): Promise<FeedbackResponse> => {
    try {
      console.log("Submitting feedback (raw input):", data);
      
      // Prepare data for submission to contacts table (as temporary solution)
      const submissionPayload = {
        name: data.customerName || 'Anonymous',
        email: 'feedback@example.com', // Required field in contacts
        subject: `Feedback for ${data.productId}`,
        message: `Issues: ${data.issues.join(', ')}\n\n${data.comments || ''}`,
        phone: data.location || null,
      };
      
      console.log("Submitting to contacts table:", submissionPayload);
      
      // Insert into contacts table (this is a temporary solution)
      const { data: insertedData, error } = await supabase
        .from('contacts')
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
      
      // Store location data in the logs since we can't add it to the contacts table
      if (data.coordinates) {
        console.log("Location coordinates captured but stored only in logs:", data.coordinates);
        console.log("Location name:", data.location);
      }
      
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
