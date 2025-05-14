import { useState } from "react";
import { Product, products } from "@/components/feedback/data/productData";

export function useProductSelection() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);

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
  };

  // Function to handle checkbox changes for issues - updated for multiple selections
  const handleIssueToggle = (issue: string) => {
    setSelectedIssues(current => {
      // If already selected, remove it
      if (current.includes(issue)) {
        return current.filter(i => i !== issue);
      } 
      // Otherwise add it (allows multiple selection)
      return [...current, issue];
    });
  };

  return {
    selectedProduct,
    selectedVariant,
    selectedIssues,
    setSelectedIssues,
    handleProductSelect,
    handleVariantSelect,
    handleIssueToggle
  };
}
