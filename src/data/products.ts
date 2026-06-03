export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  longDescription: string;
  ingredients: string[];
  image: string;
  badge?: string;
  rating: number;
  reviews: number;
  isPopular?: boolean;
  isBestSeller?: boolean;
  modifiers?: { label: string; options: string[]; prices?: number[] }[];
}

export const categories = [
  "All",
  "Meatpie & Pastries",
  "Drinks",
];

export const products: Product[] = [
  {
    id: "meatpie-classic",
    name: "Signature Meatpie",
    category: "Meatpie & Pastries",
    price: 1500,
    originalPrice: 1800,
    description: "Golden-crust pastry filled with seasoned minced meat & veggies",
    longDescription:
      "Our legendary Signature Meatpie is Darla's most iconic dish. Each pie is hand-crafted with a buttery, flaky golden crust that shatters perfectly with every bite, revealing a rich filling of well-seasoned minced beef, tender potatoes, carrots, and aromatic spices. Baked fresh daily to perfection.",
    ingredients: [
      "Minced Beef",
      "Potatoes",
      "Carrots",
      "Onions",
      "Green Peas",
      "Butter",
      "Flour",
      "Aromatic Spices",
      "Eggs",
    ],
    image: "/meatpie.jpg",
    badge: "Signature",
    rating: 4.9,
    reviews: 1284,
    isPopular: true,
    isBestSeller: true,
    modifiers: [
      { label: "Size", options: ["Regular", "Large (x2 filling)"] },
      { label: "Extra Side", options: ["No Side", "Chilled Juice", "Soft Drink", "Water"] },
    ],
  },
  {
    id: "chapman-drink",
    name: "Chilled Chapman",
    category: "Drinks",
    price: 800,
    description: "Refreshing Nigerian Chapman cocktail mocktail with fresh citrus",
    longDescription:
      "Nigeria's favorite refreshing mocktail — a beautiful blend of Fanta Orange, Fanta Strawberry, Angostura bitters, cucumber slices, and fresh citrus, topped with ice.",
    ingredients: [
      "Fanta Orange",
      "Fanta Strawberry",
      "Angostura Bitters",
      "Fresh Cucumber",
      "Citrus Slices",
      "Ice",
    ],
    image:
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&q=80",
    rating: 4.8,
    reviews: 634,
    modifiers: [
      { label: "Size", options: ["Regular (50cl)", "Large (1L)"] },
    ],
  },
  {
    id: "meat-sausage-roll",
    name: "Flaky Sausage Roll",
    category: "Meatpie & Pastries",
    price: 800,
    description: "Buttery flaky pastry wrapped around spiced pork & beef sausage",
    longDescription:
      "Our Flaky Sausage Roll is made with the same premium flaky pastry as our signature meatpie, wrapped around a perfectly seasoned blend of pork and beef sausage, glazed with egg wash and baked golden.",
    ingredients: [
      "Pork Sausage",
      "Beef",
      "Flaky Pastry",
      "Onions",
      "Mixed Herbs",
      "Egg Wash",
    ],
    image: "/sausage-rolls.jpg",
    rating: 4.6,
    reviews: 523,
    isPopular: true,
    modifiers: [
      { label: "Quantity", options: ["1 piece", "2 pieces", "3 pieces", "6 pieces"] },
    ],
  },
];

export const bestSellers = products.filter((p) => p.isBestSeller);

export const getProductById = (id: string) =>
  products.find((p) => p.id === id);

export const getProductsByCategory = (category: string) =>
  category === "All"
    ? products
    : products.filter((p) => p.category === category);

export const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);
