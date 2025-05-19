
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
   * Check if the feedback table exists in Supabase
   */
  checkFeedbackTable: async (): Promise<boolean> => {
    try {
      // Check if we can query the table (this won't throw if table exists but is empty)
      const { error } = await supabase
        .from('feedback')
        .select('id')
        .limit(1);
      
      if (error) {
        console.error('Table check error:', error);
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error checking table:', error);
      return false;
    }
  },
  
  /**
   * Create feedback table in Supabase if it doesn't exist
   * Note: This requires RLS policies to be set up correctly
   */
  createFeedbackTable: async (): Promise<boolean> => {
    // In a real app, you would use Supabase migrations or server-side code
    // This is just for demonstration purposes in this prototype
    const message = `
      The 'feedback' table doesn't exist in your Supabase project.
      
      Please create it with the following structure:
      - customer_name (text, nullable)
      - location (text, nullable)
      - product_id (text, not null)
      - variant_id (text, not null)
      - issues (text array, not null)
      - comments (text, nullable)
      - latitude (float8, nullable)
      - longitude (float8, nullable)
      - created_at (timestamp with time zone, default: now())
    `;
    
    console.warn(message);
    return false;
  },

  /**
   * Submit feedback to Supabase
   */
  submitFeedback: async (data: FeedbackSubmission): Promise<FeedbackResponse> => {
    try {
      console.log("Submitting feedback (raw input):", data);
      
      // First check if the table exists
      const tableExists = await FeedbackService.checkFeedbackTable();
      
      if (!tableExists) {
        await FeedbackService.createFeedbackTable();
        return {
          id: '',
          submitted: false,
          timestamp: new Date().toISOString(),
          message: "The feedback table doesn't exist in your Supabase project. Please check the console for setup instructions."
        };
      }
      
      // Prepare data for Supabase
      const submissionPayload: {
        customer_name: string | null;
        location: string | null;
        product_id: string;
        variant_id: string;
        issues: string[];
        comments: string | null;
        latitude?: number;
        longitude?: number;
      } = {
        customer_name: data.customerName || null,
        location: data.location || null,
        product_id: data.productId,
        variant_id: data.variantId,
        issues: data.issues,
        comments: data.comments || null,
      };
      
      // Add coordinates if they exist
      if (data.coordinates) {
        submissionPayload.latitude = data.coordinates.latitude;
        submissionPayload.longitude = data.coordinates.longitude;
      }
      
      console.log("Cleaned submission data (with coordinates):", submissionPayload);
      
      const { data: insertedData, error } = await supabase
        .from('feedback')
        .insert(submissionPayload)
        .select('id, created_at')
        .single();
      
      if (error) {
        console.error('Supabase error during submission:', error);
        
        // Check if error is due to missing table
        if (error.code === '42P01') {
          return {
            id: '',
            submitted: false,
            timestamp: new Date().toISOString(),
            message: "The 'feedback' table doesn't exist in your Supabase project. Please create it first."
          };
        }
        
        // Return more specific error message
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
