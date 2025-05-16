
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Gift, BadgeDollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StarRating } from "@/components/ui/star-rating";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";

export default function ThankYou() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [rating, setRating] = useState(5); // Default to 5 stars
  const [hasRated, setHasRated] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showGiftDialog, setShowGiftDialog] = useState(false);
  const [submittedContact, setSubmittedContact] = useState(false);
  
  // Get the data from location state or set defaults if not available
  const customerName = location.state?.customerName || "Valued Customer";
  const productName = location.state?.productName || "our products";
  
  // Show gift dialog immediately when the component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowGiftDialog(true);
    }, 1200); // Show after a short delay so user can read the thank you message
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handler for when user submits their rating
  const handleRatingSubmit = () => {
    toast.success(`Thank you for your ${rating}-star rating!`);
    setHasRated(true);
  };
  
  // Phone number input handler
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
  };
  
  // Submit contact info
  const handleContactSubmit = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    // Here you would send this to your database
    console.log("Phone number submitted:", phoneNumber);
    
    toast.success("Thank you! You're now entered into our customer rewards program!");
    setSubmittedContact(true);
    setShowGiftDialog(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-rose-50 to-gray-50">
      <div className="absolute inset-0 w-full h-full">
        <div className="w-full h-full bg-[radial-gradient(#FFC72C_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
      </div>
      
      <Card className="max-w-md w-full shadow-lg border-t-4 border-t-indomie-red animate-fade-in relative overflow-hidden">
        <CardHeader className="pt-6 pb-0 flex flex-col items-center">
          {/* Card header content */}
        </CardHeader>
        
        <CardContent className="pt-4 pb-6 text-center space-y-4">
          <h1 className="text-2xl font-bold text-indomie-red">Thank You!</h1>
          
          <p className="text-gray-700">
            Thank you {customerName} for your valuable feedback about {productName}. Your input helps us improve our products and services.
          </p>
          
          {!submittedContact && (
            <div className="mt-6 animate-pulse">
              <Button 
                variant="outline"
                className="border-dashed border-2 border-indomie-yellow hover:border-indomie-yellow/80 hover:bg-amber-50/50 group transition-all duration-300"
                onClick={() => setShowGiftDialog(true)}
              >
                <div className="flex items-center justify-center gap-2">
                  <div className="relative">
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-indomie-yellow rounded-full animate-ping"></div>
                    <Gift className="h-5 w-5 text-indomie-yellow group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="font-medium text-indomie-red">Claim Your Reward!</span>
                </div>
              </Button>
            </div>
          )}
          
          {submittedContact && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200 animate-fade-in">
              <div className="flex items-center justify-center gap-2 text-red-600">
                <BadgeDollarSign className="h-5 w-5" />
                <span className="font-medium">You're entered in our rewards program!</span>
              </div>
            </div>
          )}
          
          <div className="py-6 space-y-4">
            <h2 className="text-lg font-semibold">How was your experience using our feedback system?</h2>
            
            <div className="flex justify-center">
              <StarRating
                value={rating}
                onChange={!hasRated ? setRating : undefined}
                max={5}
                size={isMobile ? "md" : "lg"}
                color="text-indomie-yellow"
                showValue={true}
                readOnly={hasRated}
              />
            </div>
            
            {!hasRated && (
              <Button 
                onClick={handleRatingSubmit}
                className="bg-indomie-red hover:bg-indomie-red/90 mt-2"
              >
                Submit Rating
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={showGiftDialog} onOpenChange={setShowGiftDialog}>
        <DialogContent className={`${isMobile ? "w-[95%] p-4 max-h-[90vh] overflow-auto" : "sm:max-w-md"} border-2 border-indomie-yellow`}>
          <DialogHeader className="relative z-10">
            <DialogDescription className="text-center text-indomie-red">
              Thanks for your feedback! We're giving away exclusive rewards to our loyal customers.
            </DialogDescription>
          </DialogHeader>
          
          <div className={`${isMobile ? "p-3" : "p-6"} relative z-10`}>
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-4 rounded-lg mb-4 border border-indomie-yellow shadow-inner">
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <Gift className="h-12 w-12 text-indomie-yellow" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-indomie-red rounded-full animate-pulse"></div>
                </div>
                <h3 className="font-bold text-lg text-indomie-red">Join Our Rewards Program</h3>
                <p className="text-center text-sm text-gray-700">
                  Enter your contact number below to join our rewards program and get a chance to win exclusive gifts and discounts!
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1 text-indomie-red">
                  Contact Number
                </label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  className="w-full border-indomie-yellow focus:border-indomie-red focus:ring-indomie-red"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Your information will be kept confidential and only used for rewards.
                </p>
              </div>
              
              <div className={`flex ${isMobile ? "flex-col" : "flex-row justify-end"} gap-3`}>
                <DialogClose asChild>
                  <Button variant="outline" className="transition-none hover:bg-transparent w-full">
                    Maybe Later
                  </Button>
                </DialogClose>
                <Button 
                  onClick={handleContactSubmit}
                  className="bg-indomie-red transition-none hover:bg-indomie-red w-full"
                >
                  Join Rewards Program
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
