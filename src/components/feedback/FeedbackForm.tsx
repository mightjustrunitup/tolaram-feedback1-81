
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
    scannedBarcodeData,
    scannedProductInfo,
    handleImageUpload,
    handleImageRemove,
    handleCameraCapture,
    handleBarcodeScanned,
    toggleCamera,
    uploadFilesToStorage,
    clearBarcodeData // Add this to clear barcode data
  } = useImageHandling();

  // Log when images change to verify they're being processed correctly
  useEffect(() => {
    if (uploadedImageUrls.length > 0) {
      console.log("Current images in FeedbackForm:", uploadedImageUrls);
    }
  }, [uploadedImageUrls]);

  // Auto-select product when barcode is scanned
  useEffect(() => {
    if (scannedBarcodeData && scannedProductInfo) {
      console.log("Barcode scanned, auto-selecting product:", scannedProductInfo);
      
      // Try to find and select the product based on scanned data
      const productId = scannedProductInfo?.product_id || scannedBarcodeData;
      const product = products.find(p => p.id === productId);
      
      if (product) {
        handleProductSelect(product.id);
        if (product.variants.length > 0) {
          handleVariantSelect(product.variants[0].id);
        }
      }
    }
  }, [scannedBarcodeData, scannedProductInfo, handleProductSelect, handleVariantSelect]);

  // Enhanced product select handler that clears barcode data when manually selecting a different product
  const handleProductSelectWithBarcodeReset = (productId: string) => {
    // If there's existing barcode data and user is selecting a different product, clear the barcode
    if (scannedBarcodeData && selectedProduct?.id !== productId) {
      clearBarcodeData();
      console.log("Clearing barcode data due to manual product selection");
    }
    handleProductSelect(productId);
  };

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
      scannedBarcodeData={scannedBarcodeData}
      scannedProductInfo={scannedProductInfo}
      onInputChange={handleInputChange}
      handleProductSelect={handleProductSelectWithBarcodeReset}
      handleVariantSelect={handleVariantSelect}
      handleIssueToggle={handleIssueToggle}
      onImageUpload={handleImageUpload}
      onImageRemove={handleImageRemove}
      isCameraActive={isCameraActive}
      onCameraCapture={handleCameraCapture}
      onBarcodeScanned={handleBarcodeScanned}
      onToggleCamera={toggleCamera}
      onSubmit={handleSubmit}
      isUploading={isUploading}
    />
  );
};
