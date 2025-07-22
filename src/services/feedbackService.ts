import { get, post } from "@/lib/api";
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

export interface ApiResponse {
  id?: string;
  message?: string;
  success?: boolean;
}

/**
 * Service for feedback-related API operations using PHP backend
 */
export const FeedbackService = {
  /**
   * Test if we can access the feedback endpoint
   */
  testTableAccess: async () => {
    try {
      const data = await get('/api/feedback/list');
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Convert images to base64 for PHP upload
   */
  convertImagesToBase64: async (files: File[]): Promise<string[]> => {
    if (!files || files.length === 0) return [];
    
    const base64Images: string[] = [];
    
    for (const file of files) {
      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        
        base64Images.push(base64);
      } catch (error) {
        console.error("Error converting file to base64:", error);
      }
    }
    
    return base64Images;
  },

  /**
   * Submit feedback to the PHP backend
   */
  submitFeedback: async (data: FeedbackSubmission): Promise<FeedbackResponse> => {
    try {
      console.log("Submitting feedback to PHP backend:", {
        ...data,
        imageFiles: data.imageFiles ? `${data.imageFiles.length} files` : 'none'
      });
      
      // Convert images to base64 for upload
      let imageData: string[] = [];
      if (data.imageFiles && data.imageFiles.length > 0) {
        imageData = await FeedbackService.convertImagesToBase64(data.imageFiles);
      }
      
      // Prepare data for PHP backend
      const submissionData = {
        customerName: data.customerName || null,
        location: data.location || null,
        productId: data.productId,
        variantId: data.variantId,
        issues: data.issues,
        comments: data.comments || null,
        images: imageData,
        coordinates: data.coordinates || null
      };
      
      // Submit to PHP API
      const response = await post<ApiResponse>('/api/feedback/submit', submissionData);
      
      return {
        id: response.id || Date.now().toString(),
        submitted: true,
        timestamp: new Date().toISOString(),
        message: response.message || "Feedback submitted successfully"
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
      
      const response = await post<ApiResponse>('/api/rewards/submit', {
        customerName: data.customerName || null,
        phone: data.phone,
        feedbackId: data.feedbackId || null,
        location: data.location || null,
        coordinates: data.coordinates || null
      });
      
      return {
        success: true,
        message: response.message || "Successfully joined rewards program"
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
   * Get complete feedback data from PHP backend
   */
  getCompleteFeedback: async (): Promise<CompleteFeedback[]> => {
    try {
      const data = await get<CompleteFeedback[]>('/api/feedback/list');
      return data || [];
    } catch (error) {
      console.error('Error in getCompleteFeedback:', error);
      throw error;
    }
  }
};
