
import React from "react";
import { CardTitle, CardDescription } from "@/components/ui/card";

interface Product {
  id: string;
  name: string;
  image: string;
  description?: string;
}

interface FeedbackHeaderProps {
  selectedProduct: Product | null;
}

export const FeedbackHeader: React.FC<FeedbackHeaderProps> = ({ selectedProduct }) => {
  return (
    <>
      <div className="flex flex-col items-center text-center mb-4">
        <CardTitle className="text-2xl font-bold">Welcome to Tolaram Feedback Portal</CardTitle>
        <CardDescription className="mt-2 max-w-md">
          Your opinion matters to us, and we're committed to making our products better with your input.
        </CardDescription>
      </div>
    </>
  );
};
