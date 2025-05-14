
import React from "react";
import { Product } from "./types";

interface ProductInfoSectionProps {
  product: Product;
}

export const ProductInfoSection: React.FC<ProductInfoSectionProps> = ({ product }) => {
  return (
    <div className="p-4 border border-gray-200 bg-amber-50/50 rounded-lg">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 border">
          <img 
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold text-lg">{product.name}</h3>
          <p className="text-sm text-gray-600">{product.description}</p>
        </div>
      </div>
    </div>
  );
};
