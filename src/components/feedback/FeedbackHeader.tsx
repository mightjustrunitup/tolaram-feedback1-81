
import React from "react";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

interface Product {
  id: string;
  name: string;
  image: string;
  description?: string;
}

interface FeedbackHeaderProps {
  selectedProduct: Product | null;
  scannedQRData?: string | null;
}

export const FeedbackHeader: React.FC<FeedbackHeaderProps> = ({ 
  selectedProduct, 
  scannedQRData 
}) => {
  return (
    <>
      <div className="flex flex-col items-center text-center mb-4">
        <CardTitle className="text-2xl font-bold">Welcome to Tolaram Feedback Portal</CardTitle>
        <CardDescription className="mt-2 max-w-md">
          Your opinion matters to us, and we're committed to making our products better with your input.
        </CardDescription>
        
        {scannedQRData && (
          <Badge 
            className="mt-3 px-3 py-1 bg-green-100 text-green-800 border border-green-300 flex items-center gap-2"
            variant="outline"
          >
            <CheckCircle size={16} />
            Product QR Code Verified
          </Badge>
        )}
      </div>
    </>
  );
};
