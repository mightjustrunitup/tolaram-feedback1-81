
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

import Logo from "@/components/layout/Logo";
import { Button } from "@/components/ui/button";
import { FeedbackForm } from "./components/FeedbackForm";
import { DEFAULT_PRODUCT, Product } from "./components/types";

export function FeedbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedProduct = (location.state?.selectedProduct as Product | null) || DEFAULT_PRODUCT;

  return (
    <div className="min-h-screen flex flex-col noodle-bg-light">
      {/* Fixed Header */}
      <header className="w-full bg-white border-b py-4 px-6 shadow-md fixed top-0 left-0 right-0 z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Logo />
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
          >
            Back to Home
          </Button>
        </div>
      </header>

      {/* Feedback Form - add padding-top for the fixed header */}
      <div className="flex-1 py-12 px-6 relative pt-20">
        <div className="absolute inset-0 w-full h-full">
          <div className="w-full h-full bg-[radial-gradient(#FFC72C_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>
        </div>
        
        <div className="max-w-3xl mx-auto relative z-10">
          <FeedbackForm 
            selectedProduct={selectedProduct} 
            onSubmitSuccess={(data) => {
              navigate("/thank-you", { 
                state: { 
                  customerName: data.isAnonymous ? "Valued Customer" : data.customerName,
                  email: data.email,
                  productName: selectedProduct?.name || "our products"
                } 
              });
            }} 
          />
        </div>
      </div>
    </div>
  );
}
