
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FeedbackService, FeedbackSubmission } from "@/services/feedbackService";

// Import our smaller hooks
import { useFormValidation } from "./useFormValidation";
import { useProductSelection } from "./useProductSelection";
import { useFormData } from "./useFormData";
import { useGeolocation } from "@/hooks/useGeolocation";

/**
 * Main feedback form hook that composes smaller, focused hooks
 * to manage the feedback submission process.
 */
export function useFeedbackForm() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  
  // Use our smaller, focused hooks
  const { formData, handleInputChange } = useFormData();
  
  const {
    selectedProduct,
    selectedVariant,
    selectedIssues,
    handleProductSelect,
    handleVariantSelect,
    handleIssueToggle
  } = useProductSelection();
  
  const { errors, formValid, clearError, validateForm } = useFormValidation(
    selectedProduct,
    selectedVariant,
    selectedIssues,
    formData
  );
  
  // Add geolocation hook
  const { 
    latitude, 
    longitude, 
    locationName, 
    loading: locationLoading,
    error: locationError,
    permissionGranted,
    requestLocation 
  } = useGeolocation();

  // Enhanced handlers with validation
  const handleInputWithValidation = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleInputChange(e);
    clearError(e.target.name);
  };

  const handleVariantSelectWithValidation = (variantId: string) => {
    handleVariantSelect(variantId);
    clearError('variant');
  };

  const handleIssueToggleWithValidation = (issue: string) => {
    handleIssueToggle(issue);
    clearError('issue');
  };

  const handleSubmit = async (e: React.FormEvent, imageFiles?: File[]) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Prepare location data - use detected location if available
      let locationData = formData.location;
      if (permissionGranted && locationName) {
        locationData = locationName;
      }
      
      // Prepare data to send to Supabase
      const feedbackData: FeedbackSubmission = {
        customerName: formData.customerName || undefined,
        location: locationData || undefined,
        productId: selectedProduct?.id || "",
        variantId: selectedVariant || "",
        issues: selectedIssues,
        comments: formData.comments || undefined,
        // Use the actual image files instead of URLs
        imageFiles: imageFiles,
        // Add coordinates if we have them
        coordinates: permissionGranted && latitude !== null && longitude !== null
          ? { latitude, longitude }
          : undefined
      };
      
      console.log("Preparing to submit feedback:", {
        ...feedbackData,
        imageFiles: feedbackData.imageFiles ? `${feedbackData.imageFiles.length} files` : 'none'
      });
      
      // Submit to Supabase database
      const response = await FeedbackService.submitFeedback(feedbackData);
      console.log("Submission response:", response);
      
      if (response.submitted) {
        toast.success("Feedback submitted successfully!");
        
        // Navigate to thank you page
        navigate("/thank-you", { 
          state: { 
            customerName: formData.customerName || "Valued Customer",
            productName: selectedProduct?.name || "our product",
            issues: selectedIssues,
            location: locationData,
            // Include coordinates if available
            coordinates: permissionGranted && latitude !== null && longitude !== null
              ? { latitude, longitude }
              : undefined,
            feedbackId: response.id
          } 
        });
      } else {
        // Show more specific error message if available
        const errorMessage = response.message || "Failed to submit feedback. Please try again.";
        toast.error(errorMessage);
        setSubmitting(false);
      }
    } catch (error) {
      console.error("Error in submit handler:", error);
      toast.error("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return {
    selectedProduct,
    selectedVariant,
    submitting,
    errors,
    formValid,
    formData,
    selectedIssues,
    // Add geolocation properties
    locationName,
    locationLoading,
    locationError,
    permissionGranted,
    requestLocation,
    handleInputChange: handleInputWithValidation,
    handleProductSelect,
    handleVariantSelect: handleVariantSelectWithValidation,
    handleIssueToggle: handleIssueToggleWithValidation,
    handleSubmit
  };
}
