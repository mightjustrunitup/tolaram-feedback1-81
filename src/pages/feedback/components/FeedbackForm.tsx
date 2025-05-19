
import { useState } from "react";
import { toast } from "sonner";
import { MapPin, Loader2 } from "lucide-react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { FeedbackFormData, FeedbackFormProps } from "./types";
import { CustomerInfoSection } from "./CustomerInfoSection";
import { ProductInfoSection } from "./ProductInfoSection";
import { VisitDetailsSection } from "./VisitDetailsSection";
import { RatingSection } from "./RatingSection";
import { IssueSection } from "./IssueSection";
import { CommentsSection } from "./CommentsSection";
import { useGeolocation } from "@/hooks/useGeolocation";

export const FeedbackForm = ({ selectedProduct, onSubmitSuccess }: FeedbackFormProps) => {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    location: "",
    staffFriendliness: 4,
    cleanliness: 4,
    productAvailability: 4,
    overallExperience: 4,
    comments: ""
  });
  
  // Use our new geolocation hook
  const { 
    latitude, 
    longitude, 
    locationName, 
    loading: locationLoading, 
    error: locationError,
    permissionGranted,
    requestLocation 
  } = useGeolocation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleRatingChange = (name: string, value: number) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when changed
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    // Validate name if not anonymous
    if (!isAnonymous && !formData.customerName.trim()) {
      newErrors.customerName = "Name is required";
    }
    
    // Location is now optional, so we remove the validation check
    
    // Set errors and return validity result
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setSubmitting(true);
    
    // Compile the location data
    let locationData = formData.location;
    
    // If user has granted permission and we have coordinates, use them
    if (permissionGranted && latitude !== null && longitude !== null) {
      locationData = locationName || `${latitude},${longitude}`;
    }
    
    // Simulate submission - frontend only
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Feedback submitted successfully!");
      
      // Pass data to parent component via callback
      onSubmitSuccess({
        ...formData,
        isAnonymous,
        selectedIssues,
        date,
        // Include the detected location in the form data
        location: locationData,
        // Include the raw coordinates for more precise location data
        coordinates: permissionGranted && latitude !== null && longitude !== null 
          ? { latitude, longitude } 
          : undefined
      });
    }, 1500);
  };

  return (
    <Card className="shadow-lg animate-fade-in border-t-4 border-t-indomie-red relative overflow-hidden">
      <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-indomie-yellow/30 blur-xl"></div>
      <div className="absolute -left-16 -bottom-16 w-32 h-32 rounded-full bg-indomie-red/30 blur-xl"></div>
      
      <CardHeader className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-2xl font-bold">Share Your Feedback</CardTitle>
          <Badge 
            className="px-3 py-1 bg-indomie-red/20 text-indomie-red border border-indomie-red/30 flex items-center gap-2"
            variant="outline"
          >
            <div className="w-4 h-4 rounded-hidden overflow-hidden">
              <img 
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
            Feedback for {selectedProduct.name}
          </Badge>
        </div>
        <CardDescription>
          Help us improve your {selectedProduct.name} experience by completing this short feedback form.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Information */}
          <ProductInfoSection product={selectedProduct} />

          {/* Customer Information */}
          <CustomerInfoSection 
            isAnonymous={isAnonymous}
            setIsAnonymous={setIsAnonymous}
            customerName={formData.customerName}
            email={formData.email}
            errors={errors}
            handleInputChange={handleInputChange}
          />

          {/* Visit Details */}
          <VisitDetailsSection 
            date={date}
            setDate={setDate}
            location={formData.location}
            handleInputChange={handleInputChange}
            // Add new props for location detection
            detectLocation={requestLocation}
            detectedLocation={locationName}
            locationLoading={locationLoading}
            locationError={locationError}
            permissionGranted={permissionGranted}
          />

          {/* Rating Scales */}
          <RatingSection 
            ratings={{
              staffFriendliness: formData.staffFriendliness,
              cleanliness: formData.cleanliness,
              productAvailability: formData.productAvailability,
              overallExperience: formData.overallExperience
            }}
            handleRatingChange={handleRatingChange}
          />

          {/* Issues Section - Updated to use multiple selections */}
          <IssueSection 
            selectedIssues={selectedIssues}
            setSelectedIssues={setSelectedIssues}
          />

          {/* Comments Section */}
          <CommentsSection 
            comments={formData.comments}
            handleInputChange={handleInputChange}
          />
        </form>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center relative z-10 mt-4">
        <Button variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button 
          className="bg-indomie-red hover:bg-indomie-red/90 relative overflow-hidden group"
          onClick={handleSubmit}
          disabled={submitting}
        >
          <span className="relative z-10">
            {submitting ? "Submitting..." : "Submit Feedback"}
          </span>
          <span className="absolute bottom-0 left-0 w-full h-0 bg-indomie-yellow transition-all duration-300 group-hover:h-full -z-0"></span>
        </Button>
      </CardFooter>
    </Card>
  );
};
