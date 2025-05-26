
import { ProductFeedbackForm } from "@/components/feedback/ProductFeedbackForm";
import { useFeedbackForm } from "@/components/feedback/hooks/useFeedbackForm";
import { useImageHandling } from "@/components/feedback/hooks/useImageHandling";
import { products } from "@/components/feedback/data/productData";
import { useEffect } from "react";

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
    isUploading,
    scannedQRData,
    scannedProductInfo,
    handleImageUpload,
    handleImageRemove,
    handleCameraCapture,
    handleQRCodeScanned,
    toggleCamera,
    uploadFilesToStorage
  } = useImageHandling();

  // Log when images change to verify they're being processed correctly
  useEffect(() => {
    if (uploadedImageUrls.length > 0) {
      console.log("Current images in FeedbackForm:", uploadedImageUrls);
    }
  }, [uploadedImageUrls]);

  // Auto-select product when QR code is scanned
  useEffect(() => {
    if (scannedQRData && scannedProductInfo) {
      console.log("QR code scanned, auto-selecting product:", scannedProductInfo);
      
      // Try to find and select the product based on scanned data
      const productId = scannedProductInfo?.product_id || scannedQRData;
      const product = products.find(p => p.id === productId);
      
      if (product) {
        handleProductSelect(product.id);
        if (product.variants.length > 0) {
          handleVariantSelect(product.variants[0].id);
        }
      }
    }
  }, [scannedQRData, scannedProductInfo, handleProductSelect, handleVariantSelect]);

  const handleSubmit = async (e: React.FormEvent) => {
    // Use the existing form submission handler but pass the actual image files
    return formSubmit(e, uploadedImages);
  };

  return (
    <ProductFeedbackForm
      selectedProduct={selectedProduct}
      selectedVariant={selectedVariant}
      submitting={submitting || isUploading}
      formValid={formValid}
      errors={errors}
      customerName={formData.customerName}
      location={formData.location}
      comments={formData.comments}
      selectedIssues={selectedIssues}
      uploadedImages={uploadedImageUrls}
      products={products}
      scannedQRData={scannedQRData}
      scannedProductInfo={scannedProductInfo}
      onInputChange={handleInputChange}
      handleProductSelect={handleProductSelect}
      handleVariantSelect={handleVariantSelect}
      handleIssueToggle={handleIssueToggle}
      onImageUpload={handleImageUpload}
      onImageRemove={handleImageRemove}
      isCameraActive={isCameraActive}
      onCameraCapture={handleCameraCapture}
      onQRCodeScanned={handleQRCodeScanned}
      onToggleCamera={toggleCamera}
      onSubmit={handleSubmit}
      isUploading={isUploading}
    />
  );
};
