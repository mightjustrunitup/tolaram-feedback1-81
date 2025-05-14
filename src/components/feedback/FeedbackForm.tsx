
import { ProductFeedbackForm } from "@/components/feedback/ProductFeedbackForm";
import { useFeedbackForm } from "@/components/feedback/hooks/useFeedbackForm";
import { products, PRODUCT_ISSUES } from "@/components/feedback/data/productData";

export const FeedbackForm = () => {
  const {
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
  } = useFeedbackForm();

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
      uploadedImages={uploadedImages}
      products={products}
      onInputChange={handleInputChange}
      handleProductSelect={handleProductSelect}
      handleVariantSelect={handleVariantSelect}
      handleIssueToggle={handleIssueToggle}
      onImageUpload={handleImageUpload}
      onImageRemove={handleImageRemove}
      onSubmit={handleSubmit}
    />
  );
};
