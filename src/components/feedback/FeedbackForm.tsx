
import { ProductFeedbackForm } from "@/components/feedback/ProductFeedbackForm";
import { useFeedbackForm } from "@/components/feedback/hooks/useFeedbackForm";
import { useImageHandling } from "@/components/feedback/hooks/useImageHandling";
import { products, PRODUCT_ISSUES } from "@/components/feedback/data/productData";
import { useState } from "react";

export const FeedbackForm = () => {
  const {
    selectedProduct,
    selectedVariant,
    submitting,
    errors,
    formValid,
    formData,
    selectedIssues,
    handleInputChange,
    handleProductSelect,
    handleVariantSelect,
    handleIssueToggle,
    handleSubmit: formSubmit
  } = useFeedbackForm();
  
  const {
    uploadedImageUrls,
    uploadedImages,
    isCameraActive,
    handleImageUpload,
    handleImageRemove,
    handleCameraCapture,
    toggleCamera,
    uploadFilesToStorage
  } = useImageHandling();

  const handleSubmit = async (e: React.FormEvent) => {
    // Use the existing form submission handler but pass the actual image files
    return formSubmit(e, uploadedImages);
  };

  return (
    <ProductFeedbackForm
      selectedProduct={selectedProduct}
      selectedVariant={selectedVariant}
      submitting={submitting}
      formValid={formValid}
      errors={errors}
      customerName={formData.customerName}
      location={formData.location}
      comments={formData.comments}
      selectedIssues={selectedIssues}
      uploadedImages={uploadedImageUrls}
      products={products}
      onInputChange={handleInputChange}
      handleProductSelect={handleProductSelect}
      handleVariantSelect={handleVariantSelect}
      handleIssueToggle={handleIssueToggle}
      onImageUpload={handleImageUpload}
      onImageRemove={handleImageRemove}
      isCameraActive={isCameraActive}
      onCameraCapture={handleCameraCapture}
      onToggleCamera={toggleCamera}
      onSubmit={handleSubmit}
    />
  );
};
