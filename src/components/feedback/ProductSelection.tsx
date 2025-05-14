
import React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Product {
  id: string;
  name: string;
  image: string;
  description: string;
  variants: Array<{
    id: string;
    name: string;
  }>;
}

interface ProductSelectionProps {
  products: Product[];
  selectedProduct: Product | null;
  selectedVariant: string | null;
  errors: { [key: string]: string };
  handleProductSelect: (productId: string) => void;
  handleVariantSelect: (variantId: string) => void;
}

export const ProductSelection: React.FC<ProductSelectionProps> = ({
  products,
  selectedProduct,
  selectedVariant,
  errors,
  handleProductSelect,
  handleVariantSelect,
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="product" className="flex justify-between">
          <span>Select Product</span>
          <span className="text-red-500">*</span>
        </Label>
        
        <Tabs 
          value={selectedProduct?.id || ""}
          onValueChange={handleProductSelect}
          className="w-full"
        >
          <TabsList className={cn(
            "w-full grid grid-cols-2 sm:grid-cols-4 gap-2 h-auto bg-gray-100 p-2 rounded-lg",
            errors.product ? "border-2 border-red-500" : ""
          )}>
            {products.map((product) => (
              <TabsTrigger 
                key={product.id} 
                value={product.id}
                className="flex flex-col items-center py-3 px-2 rounded-lg data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-gray-200 data-[state=active]:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 mb-2 flex items-center justify-center bg-white rounded-full p-2 shadow-sm">
                  <img 
                    src={product.image}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <span className="text-xs sm:text-sm font-medium text-center line-clamp-2">{product.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        
        {errors.product && (
          <p className="text-sm text-red-500 mt-1">{errors.product}</p>
        )}
      </div>

      {selectedProduct && (
        <div className="space-y-2 mt-4">
          <Label htmlFor="variant" className="flex justify-between">
            <span>Select {selectedProduct.name} Variant</span>
            <span className="text-red-500">*</span>
          </Label>
          <RadioGroup 
            value={selectedVariant || ""} 
            onValueChange={handleVariantSelect}
            className={cn(
              "grid grid-cols-1 sm:grid-cols-2 gap-2 p-2", 
              errors.variant ? "border-2 border-red-500 rounded-md" : ""
            )}
          >
            {selectedProduct.variants.map((variant) => (
              <div key={variant.id} className="flex items-center space-x-2 p-3 rounded-md border border-gray-200 bg-white shadow-sm">
                <RadioGroupItem value={variant.id} id={variant.id} />
                <Label htmlFor={variant.id} className="cursor-pointer flex-grow text-sm font-medium">
                  {variant.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {errors.variant && (
            <p className="text-sm text-red-500 mt-1">{errors.variant}</p>
          )}
        </div>
      )}
    </>
  );
};
