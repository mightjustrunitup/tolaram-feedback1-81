
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import Logo from "@/components/layout/Logo";
import { toast } from "sonner";
import { FeedbackService, FeedbackSubmission } from "@/services/feedbackService";
import { CustomerInfoForm } from "@/components/feedback/CustomerInfoForm";
import { ProductSelection } from "@/components/feedback/ProductSelection";
import { IssueSelection } from "@/components/feedback/IssueSelection";
import { FeedbackHeader } from "@/components/feedback/FeedbackHeader";
import { products, PRODUCT_ISSUES, Product } from "@/components/feedback/data/productData";

const Index = () => {
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

  // Example of how to load products from backend
  // Uncomment this when your buddy's API is ready
  /*
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const apiProducts = await FeedbackService.getProducts();
        // Process and set products here
      } catch (error) {
        toast.error("Failed to load products. Please try again.");
        console.error("Error loading products:", error);
      }
    };
    
    loadProducts();
  }, []);
  */

  // Example of how to load variants when a product is selected
  // Uncomment this when your buddy's API is ready
  /*
  useEffect(() => {
    if (!selectedProduct?.id) return;
    
    const loadVariants = async () => {
      try {
        const apiVariants = await FeedbackService.getProductVariants(selectedProduct.id);
        // Process and update the selected product's variants
      } catch (error) {
        toast.error("Failed to load product variants. Please try again.");
        console.error("Error loading variants:", error);
      }
    };
    
    loadVariants();
  }, [selectedProduct?.id]);
  */

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

  // Function to handle checkbox changes for issues
  const handleIssueToggle = (issue: string) => {
    setSelectedIssues(current => {
      // If already selected, remove it
      if (current.includes(issue)) {
        return current.filter(i => i !== issue);
      } 
      // Otherwise add it
      return [...current, issue];
    });
    
    // Clear issue error if any issue is selected
    if (errors.issue) {
      setErrors(prev => ({ ...prev, issue: "" }));
    }
  };
  
  // New function to handle image uploads
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

    // Validate at least one issue is selected
    if (selectedProduct && selectedVariant && selectedIssues.length === 0) {
      newErrors.issue = "Please select at least one issue with the product";
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 to-gray-50">
      {/* Fixed Header */}
      <header className="w-full bg-white border-b py-4 px-6 shadow-md fixed top-0 left-0 right-0 z-20">
        <div className="max-w-7xl mx-auto flex justify-center items-center">
          <Logo />
        </div>
      </header>

      {/* Feedback Form */}
      <div className="flex-1 py-8 px-6 relative pt-24 md:pt-28">
        <div className="absolute inset-0 w-full h-full">
          <div className="w-full h-full bg-[radial-gradient(#64748b_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
        </div>
        
        <div className="max-w-3xl mx-auto relative z-10">
          <Card className="shadow-lg animate-fade-in border-t-4 border-t-indomie-red relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-blue-100/30 blur-xl"></div>
            <div className="absolute -left-16 -bottom-16 w-32 h-32 rounded-full bg-green-100/30 blur-xl"></div>
            
            <CardHeader className="relative z-10">
              <FeedbackHeader selectedProduct={selectedProduct} />
            </CardHeader>
            
            <CardContent className="relative z-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Information */}
                <CustomerInfoForm 
                  customerName={formData.customerName}
                  location={formData.location}
                  onInputChange={handleInputChange}
                  errors={errors}
                />

                {/* Product Selection */}
                <ProductSelection
                  products={products}
                  selectedProduct={selectedProduct}
                  selectedVariant={selectedVariant}
                  errors={errors}
                  handleProductSelect={handleProductSelect}
                  handleVariantSelect={handleVariantSelect}
                />

                {/* Product Issues - Only display if a variant is selected */}
                {selectedVariant && (
                  <IssueSelection
                    issues={PRODUCT_ISSUES}
                    selectedIssues={selectedIssues}
                    comments={formData.comments}
                    handleIssueToggle={handleIssueToggle}
                    onInputChange={handleInputChange}
                    errors={errors}
                    uploadedImages={uploadedImages}
                    onImageUpload={handleImageUpload}
                    onImageRemove={handleImageRemove}
                  />
                )}
                
                <CardFooter className="flex justify-end items-center pt-4 px-0">
                  <Button 
                    className="transition-colors"
                    type="submit"
                    disabled={submitting || !formValid}
                    variant={formValid ? "default" : "disabled-red"}
                    style={{
                      backgroundColor: formValid ? "#ea384c" : undefined
                    }}
                  >
                    {submitting ? "Submitting..." : "Submit Feedback"}
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
