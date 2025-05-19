
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

// SQL definitions for database enhancements
export const CREATE_FEEDBACK_INDEX_FUNCTION = `
CREATE OR REPLACE FUNCTION create_feedback_index()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  CREATE INDEX IF NOT EXISTS feedback_created_at_idx ON public.feedback (created_at);
END;
$$;
`;

export const CREATE_COMPLETE_FEEDBACK_VIEW_FUNCTION = `
CREATE OR REPLACE FUNCTION create_complete_feedback_view()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  CREATE OR REPLACE VIEW public.complete_feedback AS
  SELECT
    f.id,
    f.created_at,
    f.updated_at,
    f.customer_name,
    f.location,
    f.product_id,
    f.variant_id,
    f.comments,
    array_agg(DISTINCT fi.issue) FILTER (WHERE fi.issue IS NOT NULL) AS issues,
    json_object_agg(DISTINCT fr.category, fr.score) FILTER (WHERE fr.category IS NOT NULL) AS ratings,
    array_agg(DISTINCT fim.image_url) FILTER (WHERE fim.image_url IS NOT NULL) AS images
  FROM
    public.feedback f
  LEFT JOIN
    public.feedback_issues fi ON f.id = fi.feedback_id
  LEFT JOIN
    public.feedback_ratings fr ON f.id = fr.feedback_id
  LEFT JOIN
    public.feedback_images fim ON f.id = fim.feedback_id
  GROUP BY
    f.id, f.created_at, f.updated_at, f.customer_name, f.location, f.product_id, f.variant_id, f.comments;
END;
$$;
`;

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
  ratings: {
    staffFriendliness?: number;
    cleanliness?: number;
    productAvailability?: number;
    overallExperience?: number;
    [key: string]: number | undefined;
  } | null;
  images: string[] | null;
}
