
import { useState, useEffect } from "react";
import { Product } from "@/components/feedback/data/productData";

export function useFormValidation(
  selectedProduct: Product | null,
  selectedVariant: string | null,
  selectedIssues: string[],
  formData: { [key: string]: string }
) {
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [formValid, setFormValid] = useState(false);

  // Check form validity whenever relevant fields change
  useEffect(() => {
    const isValid = selectedProduct !== null && 
                    selectedVariant !== null && 
                    selectedIssues.length > 0;
    setFormValid(isValid);
  }, [selectedProduct, selectedVariant, selectedIssues]);

  const clearError = (name: string) => {
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
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

  return { errors, formValid, setErrors, clearError, validateForm };
}
