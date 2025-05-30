
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FeedbackHeader } from "@/components/feedback/FeedbackHeader";
import { CustomerInfoForm } from "@/components/feedback/CustomerInfoForm";
import { ProductSelection } from "@/components/feedback/ProductSelection";
import { IssueSelection } from "@/components/feedback/IssueSelection";
import { Product } from "@/components/feedback/data/productData";

// Define the product issues
const PRODUCT_ISSUES = [
  "Mislabelled products",
  "Unusual taste or odor",
  "Texture - too hard or soft",
  "Mold or spoilage",
  "Foreign elements"
];

interface ProductFeedbackFormProps {
  selectedProduct: Product | null;
  selectedVariant: string | null;
  submitting: boolean;
  formValid: boolean;
  errors: {[key: string]: string};
  customerName: string;
  location: string;
  comments: string;
  selectedIssues: string[];
  uploadedImages: string[];
  products: Product[];
  scannedBarcodeData?: string | null;
  scannedProductInfo?: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleProductSelect: (productId: string) => void;
  handleVariantSelect: (variantId: string) => void;
  handleIssueToggle: (issue: string) => void;
  onImageUpload: (files: FileList) => void;
  onImageRemove: (index: number) => void;
  isCameraActive?: boolean;
  onCameraCapture?: (imageData: string) => void;
  onBarcodeScanned?: (barcodeData: string, productInfo?: any) => void;
  onToggleCamera?: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isUploading?: boolean;
}

export const ProductFeedbackForm: React.FC<ProductFeedbackFormProps> = ({
  selectedProduct,
  selectedVariant,
  submitting,
  formValid,
  errors,
  customerName,
  location,
  comments,
  selectedIssues,
  uploadedImages,
  products,
  scannedBarcodeData,
  scannedProductInfo,
  onInputChange,
  handleProductSelect,
  handleVariantSelect,
  handleIssueToggle,
  onImageUpload,
  onImageRemove,
  isCameraActive,
  onCameraCapture,
  onBarcodeScanned,
  onToggleCamera,
  onSubmit,
  isUploading = false
}) => {
  return (
    <Card className="shadow-lg animate-fade-in border-t-4 border-t-indomie-red relative overflow-hidden">
      <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-blue-100/30 blur-xl"></div>
      <div className="absolute -left-16 -bottom-16 w-32 h-32 rounded-full bg-green-100/30 blur-xl"></div>
      
      <CardHeader className="relative z-10">
        <FeedbackHeader selectedProduct={selectedProduct} />
      </CardHeader>
      
      <CardContent className="relative z-10">
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Customer Information */}
          <CustomerInfoForm 
            customerName={customerName}
            location={location}
            onInputChange={onInputChange}
            errors={errors}
          />

          {/* Product Selection - Remove barcode display from here */}
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
              comments={comments}
              handleIssueToggle={handleIssueToggle}
              onInputChange={onInputChange}
              errors={errors}
              uploadedImages={uploadedImages}
              onImageUpload={onImageUpload}
              onImageRemove={onImageRemove}
              isCameraActive={isCameraActive}
              onCameraCapture={onCameraCapture}
              onBarcodeScanned={onBarcodeScanned}
              onToggleCamera={onToggleCamera}
              isUploading={isUploading}
            />
          )}

          {/* Barcode Information Display - Show below comments */}
          {scannedBarcodeData && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 font-medium">
                ✓ Barcode scanned and saved
              </p>
              <p className="text-xs text-green-600 mt-1">
                Barcode: {scannedBarcodeData}
              </p>
            </div>
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
              {submitting ? (
                isUploading ? "Uploading Images..." : "Submitting..."
              ) : "Submit Feedback"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};
