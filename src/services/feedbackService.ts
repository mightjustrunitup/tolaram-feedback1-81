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
 * Service for feedback-related API operations using Supabase
 */
export const FeedbackService = {
  /**
   * Test if we can access the feedback table
   */
  testTableAccess: async () => {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .limit(1);
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Upload images to Supabase Storage
   */
  uploadImages: async (files: File[]): Promise<string[]> => {
    if (!files || files.length === 0) return [];
    
    const uploadedUrls: string[] = [];
    
    for (const file of files) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = fileName;

        const { error: uploadError } = await supabase.storage
          .from('feedback-images')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          continue;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('feedback-images')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
    
    return uploadedUrls;
  },

  /**
   * Submit feedback to Supabase
   */
  submitFeedback: async (data: FeedbackSubmission): Promise<FeedbackResponse> => {
    try {
      console.log("Submitting feedback to Supabase:", {
        ...data,
        imageFiles: data.imageFiles ? `${data.imageFiles.length} files` : 'none'
      });
      
      // Upload images first
      let imageUrls: string[] = [];
      if (data.imageFiles && data.imageFiles.length > 0) {
        imageUrls = await FeedbackService.uploadImages(data.imageFiles);
      }
      
      // Insert feedback record
      const { data: feedbackData, error: feedbackError } = await supabase
        .from('feedback')
        .insert({
          customer_name: data.customerName || null,
          location: data.location || null,
          product_id: data.productId,
          variant_id: data.variantId,
          comments: data.comments || null,
        })
        .select()
        .single();

      if (feedbackError) {
        console.error('Error inserting feedback:', feedbackError);
        throw new Error(feedbackError.message);
      }

      // Insert issues
      if (data.issues && data.issues.length > 0) {
        const issueRecords = data.issues.map(issue => ({
          feedback_id: feedbackData.id,
          issue: issue
        }));

        const { error: issuesError } = await supabase
          .from('feedback_issues')
          .insert(issueRecords);

        if (issuesError) {
          console.error('Error inserting issues:', issuesError);
        }
      }

      // Insert images
      if (imageUrls.length > 0) {
        const imageRecords = imageUrls.map(url => ({
          feedback_id: feedbackData.id,
          image_url: url
        }));

        const { error: imagesError } = await supabase
          .from('feedback_images')
          .insert(imageRecords);

        if (imagesError) {
          console.error('Error inserting images:', imagesError);
        }
      }
      
      return {
        id: feedbackData.id,
        submitted: true,
        timestamp: feedbackData.created_at,
        message: "Feedback submitted successfully"
      };
    } catch (error) {
      console.error('Error submitting feedback:', error);
      let errorMessage = "Failed to submit feedback";
      if (error instanceof Error) {
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
          coordinates: data.coordinates ? JSON.stringify(data.coordinates) : null
        });

      if (error) {
        throw new Error(error.message);
      }
      
      return {
        success: true,
        message: "Successfully joined rewards program"
      };
    } catch (error) {
      console.error('Error in customer rewards submission:', error);
      let errorMessage = "Failed to join rewards program";
      if (error instanceof Error) {
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
    // This would need to be implemented if you have a products table
    return Promise.resolve([]);
  },

  /**
   * Get product variants by product ID
   */
  getProductVariants: (productId: string) => {
    // This would need to be implemented if you have a product_variants table
    return Promise.resolve([]);
  },
  
  /**
   * Get complete feedback data from Supabase
   */
  getCompleteFeedback: async (): Promise<CompleteFeedback[]> => {
    try {
      const { data, error } = await supabase
        .from('complete_feedback')
        .select('*')
        .order('created_at', { ascending: false });

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
