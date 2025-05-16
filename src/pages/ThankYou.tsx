
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle2, Gift, BadgeDollarSign, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StarRating } from "@/components/ui/star-rating";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";

export default function ThankYou() {
  const navigate = useNavigate();
  const location = useLocation();
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
        <div className="w-full h-full bg-[radial-gradient(#64748b_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
      </div>
      
      <Card className="max-w-md w-full shadow-lg border-t-4 border-t-indomie-red animate-fade-in relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-red-100/30 blur-xl"></div>
        <div className="absolute -left-16 -bottom-16 w-32 h-32 rounded-full bg-blue-100/30 blur-xl"></div>
        
        <CardHeader className="pt-8 pb-0 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
        </CardHeader>
        
        <CardContent className="pt-4 pb-6 text-center space-y-4">
          <h1 className="text-2xl font-bold text-green-700">Thank You!</h1>
          
          <p className="text-gray-700">
            Thank you {customerName} for your valuable feedback about {productName}. Your input helps us improve our products and services.
          </p>
          
          {!submittedContact && (
            <div className="mt-6 animate-pulse">
              <Button 
                variant="outline"
                className="border-dashed border-2 border-orange-300 hover:border-orange-400 hover:bg-orange-50/50 group transition-all duration-300"
                onClick={() => setShowGiftDialog(true)}
              >
                <div className="flex items-center justify-center gap-2">
                  <div className="relative">
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full animate-ping"></div>
                    <Gift className="h-5 w-5 text-orange-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="font-medium text-orange-600">Claim Your Reward!</span>
                </div>
              </Button>
            </div>
          )}
          
          {submittedContact && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200 animate-fade-in">
              <div className="flex items-center justify-center gap-2 text-green-600">
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
                size="lg"
                color="text-yellow-400"
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
      
      {/* Enhanced Gift Dialog with more attractive design */}
      <Dialog open={showGiftDialog} onOpenChange={setShowGiftDialog}>
        <DialogContent className="sm:max-w-md border-2 border-orange-300 overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-orange-100 rounded-full blur-xl"></div>
          <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-yellow-100 rounded-full blur-xl"></div>
          
          <DialogHeader className="relative z-10">
            <div className="flex flex-col items-center space-y-2 py-2">
              <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                <Award className="h-8 w-8 text-orange-500" />
              </div>
              <DialogTitle className="text-2xl font-bold text-orange-700">Special Reward!</DialogTitle>
            </div>
            <DialogDescription className="text-center text-orange-700">
              Thanks for your feedback! We're giving away exclusive rewards to our loyal customers.
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-6 relative z-10">
            <div className="bg-gradient-to-r from-orange-100 to-amber-50 p-4 rounded-lg mb-4 border border-orange-200 shadow-inner">
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <Gift className="h-12 w-12 text-orange-500" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 rounded-full animate-pulse"></div>
                </div>
                <h3 className="font-bold text-lg text-orange-800">Join Our Rewards Program</h3>
                <p className="text-center text-sm text-orange-700">
                  Enter your contact number below to join our rewards program and get a chance to win exclusive gifts and discounts!
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1 text-orange-700">
                  Contact Number
                </label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  className="w-full border-orange-300 focus:border-orange-500 focus:ring-orange-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Your information will be kept confidential and only used for rewards.
                </p>
              </div>
              
              <div className="flex gap-3 justify-end">
                <DialogClose asChild>
                  <Button variant="outline">Maybe Later</Button>
                </DialogClose>
                <Button 
                  onClick={handleContactSubmit}
                  className="bg-orange-500 hover:bg-orange-600 relative overflow-hidden group"
                >
                  <span className="relative z-10">Join Rewards Program</span>
                  <span className="absolute bottom-0 left-0 w-full h-0 bg-yellow-400 transition-all duration-300 group-hover:h-full -z-0"></span>
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
