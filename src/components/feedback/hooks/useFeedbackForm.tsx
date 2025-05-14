import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FeedbackService, FeedbackSubmission } from "@/services/feedbackService";
import { Product, products, PRODUCT_ISSUES } from "@/components/feedback/data/productData";

export function useFeedbackForm() {
  const navigate = useNavigate();
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [formValid, setFormValid] = useState(false);
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    customerName: "",
    location: "",
    comments: ""
  });

  // Check form validity whenever relevant fields change
  useEffect(() => {
    const isValid = selectedProduct !== null && 
                    selectedVariant !== null && 
                    selectedIssues.length > 0;
    setFormValid(isValid);
  }, [selectedProduct, selectedVariant, selectedIssues]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleProductSelect = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      // Reset the selected variant when product changes
      setSelectedVariant(null);
      // Reset the selected issues when product changes
      setSelectedIssues([]);
    }
  };

  const handleVariantSelect = (variantId: string) => {
    setSelectedVariant(variantId);
    // Reset the selected issues when variant changes
    setSelectedIssues([]);
    // Clear variant error if it exists
    if (errors.variant) {
      setErrors(prev => ({ ...prev, variant: "" }));
    }
  };

  // Function to handle radio button changes for issues
  const handleIssueToggle = (issue: string) => {
    setSelectedIssues(current => {
      // If already selected, remove it
      if (current.includes(issue)) {
        return current.filter(i => i !== issue);
      } 
      // Otherwise add it (single selection)
      return [issue];
    });
    
    // Clear issue error if any issue is selected
    if (errors.issue) {
      setErrors(prev => ({ ...prev, issue: "" }));
    }
  };
  
  // Handle image uploads
  const handleImageUpload = (files: FileList) => {
    if (files) {
      const newImages: string[] = [];
      
      Array.from(files).forEach(file => {
        // Limit to image files
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not an image file`);
          return;
        }
        
        // Create URL for preview
        const imageUrl = URL.createObjectURL(file);
        newImages.push(imageUrl);
      });
      
      if (newImages.length > 0) {
        setUploadedImages(prev => [...prev, ...newImages]);
        toast.success(`${newImages.length} image${newImages.length > 1 ? 's' : ''} uploaded`);
      }
    }
  };

  // Handle removing uploaded images
  const handleImageRemove = (index: number) => {
    setUploadedImages(prevImages => {
      const updatedImages = [...prevImages];
      // Release the object URL to avoid memory leaks
      URL.revokeObjectURL(updatedImages[index]);
      // Remove the image from the array
      updatedImages.splice(index, 1);
      toast.info("Image removed");
      return updatedImages;
    });
  };
  
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    // Validate product selection
    if (!selectedProduct) {
      newErrors.product = "Please select a product";
    }

    // Validate variant selection
    if (selectedProduct && !selectedVariant) {
      newErrors.variant = "Please select a product variant";
    }

    // Validate one issue is selected
    if (selectedProduct && selectedVariant && selectedIssues.length === 0) {
      newErrors.issue = "Please select an issue with the product";
    }
    
    // Set errors and return validity result
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
    handleInputChange,
    handleProductSelect,
    handleVariantSelect,
    handleIssueToggle,
    handleImageUpload,
    handleImageRemove,
    handleSubmit
  };
}
