
// Types for the feedback form
export interface Product {
  id: string;
  name: string;
  image: string;
  description: string;
}

export interface FeedbackFormData {
  customerName: string;
  email: string;
  location: string;
  staffFriendliness: number;
  cleanliness: number;
  productAvailability: number;
  overallExperience: number;
  comments: string;
  isAnonymous: boolean;
  selectedIssue?: string;
  date: Date;
}

export interface FeedbackFormProps {
  selectedProduct: Product;
  onSubmitSuccess: (data: FeedbackFormData) => void;
}

// Default product to use when no product is selected
export const DEFAULT_PRODUCT: Product = {
  id: "general",
  name: "Our Products",
  image: "https://placehold.co/400x300/FFFFFF/E51E25?text=Tolaram",
  description: "Please provide your general feedback about our products and services"
};

// Example locations - updated with new examples
export const LOCATIONS = [
  "Ikeja",
  "Badagry",
  "Lekki",
  "Abuja",
  "Port Harcourt",
  "Ibadan",
  "Kano",
  "Enugu"
];

// Issues list
export const PRODUCT_ISSUES = [
  "Mislabelled products / allergies",
  "Unusual taste or odor",
  "Texture - too hard or soft",
  "Mold or spoilage",
  "Foreign elements",
  "Other"
];
