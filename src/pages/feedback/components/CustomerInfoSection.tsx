
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface CustomerInfoSectionProps {
  isAnonymous: boolean;
  setIsAnonymous: (value: boolean) => void;
  customerName: string;
  email: string;
  errors: { [key: string]: string };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const CustomerInfoSection: React.FC<CustomerInfoSectionProps> = ({
  isAnonymous,
  setIsAnonymous,
  customerName,
  email,
  errors,
  handleInputChange
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="anonymous" 
          checked={isAnonymous}
          onCheckedChange={(checked) => {
            setIsAnonymous(checked === true);
            // Clear name error if switching to anonymous
            if (checked && errors.customerName) {
              // This is handled in the parent component
            }
          }}
        />
        <label
          htmlFor="anonymous"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          I want to remain anonymous
        </label>
      </div>
      
      {!isAnonymous && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="customerName" className="flex justify-between">
              <span>Your Name</span>
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="customerName"
              name="customerName"
              placeholder="Enter your name"
              value={customerName}
              onChange={handleInputChange}
              className={errors.customerName ? "border-red-500" : ""}
            />
            {errors.customerName && (
              <p className="text-sm text-red-500 mt-1">{errors.customerName}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email (Optional)</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleInputChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};
