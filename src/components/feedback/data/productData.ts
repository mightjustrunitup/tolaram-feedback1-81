
// Define product types
export interface Product {
  id: string;
  name: string;
  image: string;
  description: string;
  variants: Array<{
    id: string;
    name: string;
    image?: string;
  }>;
}

// Use the uploaded images for products
export const products: Product[] = [
  {
    id: "indomie",
    name: "Indomie",
    image: "/lovable-uploads/461ea3d8-05b3-48c8-8bc4-9e4b89861ab6.png",
    description: "Delicious instant noodles with a variety of flavors",
    variants: [
      { 
        id: "indomie-chicken", 
        name: "Indomie Tables Chicken",
        image: "/lovable-uploads/19507191-d68b-49e6-b02b-a3fc272a922e.png"
      },
      { 
        id: "indomie-jollof", 
        name: "Indomie Jollof Flavor",
        image: "/lovable-uploads/ee01ce2c-39be-485d-800e-5bc751726dfd.png"
      },
      { 
        id: "indomie-onion-chicken", 
        name: "Indomie Onion Chicken Flavour",
        image: "/lovable-uploads/3aa5cd23-bbc0-4539-aa97-1e4a36b1e2fd.png"
      },
      { 
        id: "indomie-crayfish", 
        name: "Indomie Crayfish Flavour",
        image: "/lovable-uploads/af5c8ae0-3124-4685-b64c-05f8a28d55ac.png"
      },
      { 
        id: "indomie-chicken-pepper-soup", 
        name: "Indomie Chicken Pepper Soup",
        image: "/lovable-uploads/fca65c10-c4b6-4fa1-9336-0ee81af3afd1.png"
      },
      { 
        id: "indomie-oriental", 
        name: "Indomie Oriental Fried Noodle",
        image: "/lovable-uploads/4c92e67e-7e2a-4b02-9f0f-e94b9eef39c8.png"
      },
      { 
        id: "indomie-relish-beef", 
        name: "Indomie Relish Beef",
        image: "/lovable-uploads/4ebbb1d4-24c2-433a-971f-add5b7de206e.png"
      },
      { 
        id: "indomie-relish-seafood", 
        name: "Indomie Relish Sea Food Delight",
        image: "/lovable-uploads/f583fe31-cca9-41cd-a1f1-dccd0b32c375.png"
      }
    ]
  },
  {
    id: "minimie",
    name: "Minimie",
    image: "/lovable-uploads/874305fb-be2c-4f17-8a4f-421c6431e26b.png",
    description: "Mini-sized instant noodles perfect for snacking",
    variants: [
      { id: "minimie-chinchin", name: "Minimie Chinchin" },
      { id: "minimie-chinchin-spicy", name: "Minimie Chinchin (Hot and Spicy)" },
      { id: "minimie-noodle-chicken", name: "Minimie Instant Noodle Chicken Flavour" },
      { id: "minimie-noodle-vegetable", name: "Minimie Instant Noodle Vegetable" },
      { id: "minimie-noodle-tomato", name: "Minimie Instant Noodle Tomato" }
    ]
  },
  {
    id: "dano",
    name: "Dano Milk",
    image: "/lovable-uploads/15ba117d-4dfb-4486-b205-31156682b35f.png",
    description: "High quality milk products for your daily needs",
    variants: [
      { 
        id: "dano-slim", 
        name: "Dano Slim", 
        image: "/lovable-uploads/2c5f3951-33eb-4fed-9a3a-9cdb0e337fa4.png" 
      },
      { 
        id: "dano-cool-cow", 
        name: "Dano Cool Cow", 
        image: "/lovable-uploads/012175b8-ec5c-4474-ae7b-7f031bf68f8a.png" 
      },
      { 
        id: "dano-uht", 
        name: "Dano UHT", 
        image: "/lovable-uploads/5b7f19d0-93a3-4eb0-8c17-cce607a8cf78.png" 
      },
      { 
        id: "dano-vitakids", 
        name: "Dano Vitakids", 
        image: "/lovable-uploads/fdbfb76d-5599-4bf4-b8b8-e0de3461ec20.png" 
      }
    ]
  },
  {
    id: "kelloggs",
    name: "Kellogg's",
    image: "/lovable-uploads/2228889c-90e6-49ea-9d37-1da003554e6f.png",
    description: "Nutritious breakfast cereals for a great start to your day",
    variants: [
      { id: "kelloggs-corn-flakes", name: "Kelloggs Corn Flakes" },
      { id: "kelloggs-cocopops", name: "Kelloggs Cocopops" },
      { id: "kelloggs-frosties", name: "Kelloggs Frosties" },
      { id: "kelloggs-rice-krispies", name: "Kelloggs Rice Krispies" },
      { id: "kelloggs-crunchy-nut", name: "Kelloggs Crunchy Nut" },
      { id: "kelloggs-crispix", name: "Kelloggs Crispix" },
      { id: "kelloggs-krave", name: "Kelloggs Krave" }
    ]
  }
];

// Product issues list
export const PRODUCT_ISSUES = [
  "Mislabelled products / allergies",
  "Unusual taste or odor",
  "Texture - too hard or soft",
  "Mold or spoilage",
  "Foreign elements"
];
