
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
  comments: string;
  feedbackId?: string;
}

export interface FeedbackFormProps {
  selectedProduct: Product;
  onSubmitSuccess: (data: FeedbackFormData) => void;
}

// Default product for testing or when no product is selected
export const DEFAULT_PRODUCT: Product = {
  id: "indomie",
  name: "Indomie",
  image: "/my-uploads/461ea3d8-05b3-48c8-8bc4-9e4b89861ab6.png",
  description: "Delicious instant noodles with a variety of flavors",
  variants: [
    {
      id: "indomie-chicken",
      name: "Indomie Tables Chicken",
      image: "/my-uploads/19507191-d68b-49e6-b02b-a3fc272a922e.png"
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

// Complete feedback type definition
export interface CompleteFeedback {
  id: string;
  created_at: string;
  updated_at: string;
  customer_name: string | null;
  location: string | null;
  product_id: string;
  variant_id: string;
  comments: string | null;
  issues: string[] | null;
  images: string[] | null;
}
