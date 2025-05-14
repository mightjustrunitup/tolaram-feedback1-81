
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FeedbackService, FeedbackSubmission } from "@/services/feedbackService";

// Import our new smaller hooks
import { useFormValidation } from "./useFormValidation";
import { useProductSelection } from "./useProductSelection";
import { useImageHandling } from "./useImageHandling";
import { useFormData } from "./useFormData";

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
  
  const { uploadedImages, handleImageUpload, handleImageRemove } = useImageHandling();
  
  const { errors, formValid, clearError, validateForm } = useFormValidation(
    selectedProduct,
    selectedVariant,
    selectedIssues,
    formData
  );

  // Enhance handleInputChange to clear errors
  const handleInputWithValidation = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleInputChange(e);
    clearError(e.target.name);
  };

  // Enhanced variant select to clear errors
  const handleVariantSelectWithValidation = (variantId: string) => {
    handleVariantSelect(variantId);
    clearError('variant');
  };

  // Enhanced issue toggle to clear errors
  const handleIssueToggleWithValidation = (issue: string) => {
    handleIssueToggle(issue);
    clearError('issue');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Prepare data to send to Supabase
      const feedbackData: FeedbackSubmission = {
        customerName: formData.customerName || undefined,
        location: formData.location || undefined,
        productId: selectedProduct?.id || "",
        variantId: selectedVariant || "",
        issues: selectedIssues,
        comments: formData.comments || undefined,
        imageUrls: uploadedImages.length > 0 ? uploadedImages : undefined
      };
      
      console.log("Preparing to submit feedback:", feedbackData);
      
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
            issues: selectedIssues
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
    uploadedImages,
    handleInputChange: handleInputWithValidation,
    handleProductSelect,
    handleVariantSelect: handleVariantSelectWithValidation,
    handleIssueToggle: handleIssueToggleWithValidation,
    handleImageUpload,
    handleImageRemove,
    handleSubmit
  };
}
