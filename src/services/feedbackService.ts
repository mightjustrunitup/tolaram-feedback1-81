
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
      
      // Prepare data for submission to contacts table (temporary until types are updated)
      const submissionPayload = {
        name: data.customerName || 'Anonymous',
        email: 'feedback@example.com', // Required field in contacts
        subject: `Feedback for ${data.productId} - ${data.variantId}`,
        message: `Issues: ${data.issues.join(', ')}\n\nComments: ${data.comments || 'None'}\n\nLocation: ${data.location || 'Not provided'}\n\nCoordinates: ${data.coordinates ? `${data.coordinates.latitude}, ${data.coordinates.longitude}` : 'Not provided'}\n\nImages: ${data.imageUrls ? data.imageUrls.join(', ') : 'None'}`,
        phone: data.location || null,
      };
      
      console.log("Submitting to contacts table:", submissionPayload);
      
      // Insert into contacts table (temporary until types are updated)
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
      
      // Log the additional data that would normally go into the feedback table
      console.log("Additional feedback data (stored in message field):");
      console.log("- Product ID:", data.productId);
      console.log("- Variant ID:", data.variantId);
      console.log("- Issues:", data.issues);
      if (data.coordinates) {
        console.log("- Coordinates:", data.coordinates);
      }
      if (data.imageUrls) {
        console.log("- Image URLs:", data.imageUrls);
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
