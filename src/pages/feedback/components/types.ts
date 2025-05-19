
import { Product as DataProduct } from "@/components/feedback/data/productData";

export interface Product extends DataProduct {}

export interface FeedbackFormData {
  customerName: string;
  email: string;
  isAnonymous: boolean;
  selectedIssues: string[];
  date: Date;
  location: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  staffFriendliness: number;
  cleanliness: number;
  productAvailability: number;
  overallExperience: number;
  comments: string;
  feedbackId?: string; // Add the feedback ID to the form data
}

export interface FeedbackFormProps {
  selectedProduct: Product;
  onSubmitSuccess: (data: FeedbackFormData) => void;
}

// Default product for testing or when no product is selected
export const DEFAULT_PRODUCT: Product = {
  id: "indomie",
  name: "Indomie",
  image: "/lovable-uploads/461ea3d8-05b3-48c8-8bc4-9e4b89861ab6.png",
  description: "Delicious instant noodles with a variety of flavors",
  variants: [
    {
      id: "indomie-chicken",
      name: "Indomie Tables Chicken",
      image: "/lovable-uploads/19507191-d68b-49e6-b02b-a3fc272a922e.png"
    }
  ]
};

// Product issues list - updated with specific issues
export const PRODUCT_ISSUES = [
  "Mislabelled products",
  "Unusual taste or odor",
  "Texture - too hard or soft",
  "Mold or spoilage",
  "Foreign elements"
];
