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
      { 
        id: "minimie-chinchin", 
        name: "Minimie Chinchin", 
        image: "/lovable-uploads/044616ce-3a83-4a2d-ad81-e583ab77ea89.png"
      },
      { 
        id: "minimie-chinchin-spicy", 
        name: "Minimie Chinchin (Hot and Spicy)",
        image: "/lovable-uploads/ba7c8321-4704-423d-b9dd-28a5f175cf59.png"
      },
      { 
        id: "minimie-noodle-chicken", 
        name: "Minimie Instant Noodle Chicken Flavour",
        image: "/lovable-uploads/9d485cac-7c00-40d6-a249-902744d69cb7.png"
      },
      { 
        id: "minimie-pasta", 
        name: "Minimie Pasta",
        image: "/lovable-uploads/356b57d9-e21b-45a3-bf73-a92c7aa0b67c.png"
      },
      { 
        id: "minimie-jollof", 
        name: "Minimie Noodles Party Jollof Flavour",
        image: "/lovable-uploads/be4d2b2a-1293-4768-87e7-cb4cabdd3cac.png"
      }
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
      { 
        id: "kelloggs-corn-flakes", 
        name: "Kelloggs Corn Flakes",
        image: "/lovable-uploads/dd6a9229-c71f-464e-b21f-2bba59b16408.png"
      },
      { 
        id: "kelloggs-cocopops", 
        name: "Kelloggs Cocopops",
        image: "/lovable-uploads/ab1ce367-52c7-4794-8327-edef18df7584.png"
      },
      { 
        id: "kelloggs-frosties", 
        name: "Kelloggs Frosties",
        image: "/lovable-uploads/b1e4e618-bb02-4c79-bed5-a88290fa6a60.png"
      },
      { 
        id: "kelloggs-rice-krispies", 
        name: "Kelloggs Rice Krispies",
        image: "/lovable-uploads/75b335ee-01ac-4e4b-a724-249efb520fe5.png"
      },
      { 
        id: "kelloggs-go-grains", 
        name: "Kelloggs Go grains",
        image: "/lovable-uploads/8a39d91b-723e-4ecb-b9cf-7efcd5da4a45.png"
      },
      { 
        id: "kelloggs-fruit-n-fiber", 
        name: "Kelloggs Fruit 'n fiber",
        image: "/lovable-uploads/4629d5f3-c79a-462d-8693-ddff12f49221.png"
      },
      { 
        id: "kelloggs-moon-star", 
        name: "Kelloggs Moon & Star",
        image: "/lovable-uploads/87b8f310-db5d-4554-a66e-65ac50c9763c.png"
      }
    ]
  }
];

// Product issues list - updated with specific issues
export const PRODUCT_ISSUES = [
  "Mislabelled products",
  "Unusual taste or odor",
  "Texture - too hard or soft",
  "Mold or spoilage",
  "Foreign elements"
];
