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
  modifiers?: { label: string; options: string[] }[];
}

export const categories = [
  "All",
  "Meatpie & Pastries",
  "Rice",
  "Chicken",
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
    image:
      "https://images.unsplash.com/photo-1604579278540-f4cb4a0ae1e9?w=800&q=80",
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
    id: "fried-rice",
    name: "Darla's Fried Rice",
    category: "Rice",
    price: 2500,
    description: "Vibrant, perfectly seasoned fried rice with mixed vegetables",
    longDescription:
      "Darla's Fried Rice is a symphony of colors and flavors. Long-grain parboiled rice stir-fried in premium vegetable oil with a beautiful medley of fresh carrots, sweet corn, green beans, and spring onions. Seasoned with our secret blend of spices and topped with your choice of protein.",
    ingredients: [
      "Long-grain Parboiled Rice",
      "Carrots",
      "Sweet Corn",
      "Green Beans",
      "Spring Onions",
      "Eggs",
      "Soy Sauce",
      "Vegetable Oil",
      "Secret Spice Blend",
    ],
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&q=80",
    badge: "Fan Favourite",
    rating: 4.8,
    reviews: 962,
    isPopular: true,
    isBestSeller: true,
    modifiers: [
      { label: "Protein", options: ["No Protein", "Grilled Chicken", "Fried Beef", "Prawns"] },
      { label: "Portion", options: ["Small", "Medium", "Large", "Party Pack"] },
    ],
  },
  {
    id: "jollof-rice",
    name: "Smoky Jollof Rice",
    category: "Rice",
    price: 2200,
    description: "Classic Nigerian jollof rice with a perfect smoky party finish",
    longDescription:
      "Our Smoky Jollof Rice is cooked the traditional way — slow-simmered in a rich blend of tomatoes, red peppers, and onions, seasoned with premium bouillon and herbs. The signature party-style smoky bottom makes every serving an authentic Nigerian experience.",
    ingredients: [
      "Long-grain Rice",
      "Tomatoes",
      "Red Bell Peppers",
      "Scotch Bonnet",
      "Onions",
      "Tomato Paste",
      "Bay Leaves",
      "Curry Powder",
      "Thyme",
    ],
    image:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80",
    badge: "Party Style",
    rating: 4.7,
    reviews: 741,
    isPopular: true,
    isBestSeller: true,
    modifiers: [
      { label: "Protein", options: ["No Protein", "Chicken", "Turkey", "Fish"] },
      { label: "Portion", options: ["Small", "Medium", "Large", "Party Pack"] },
    ],
  },
  {
    id: "beans-porridge",
    name: "Honey Beans Porridge",
    category: "Rice",
    price: 1800,
    description: "Creamy, well-spiced honey beans porridge with palm oil richness",
    longDescription:
      "Our Honey Beans Porridge is comfort food elevated to an art form. Slowly cooked honey beans are simmered in red palm oil with a rich blend of ground crayfish, smoked fish, and aromatic spices. Thick, creamy, and deeply satisfying — a Nigerian classic done right.",
    ingredients: [
      "Honey Beans",
      "Palm Oil",
      "Ground Crayfish",
      "Smoked Fish",
      "Onions",
      "Locust Beans",
      "Scotch Bonnet",
      "Salt & Seasoning",
    ],
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80",
    badge: "Comfort Food",
    rating: 4.6,
    reviews: 412,
    isBestSeller: true,
    modifiers: [
      { label: "Add On", options: ["No Add-on", "Fried Plantain", "Yam", "Boiled Egg"] },
    ],
  },
  {
    id: "fried-plantain",
    name: "Sweet Fried Plantain",
    category: "Rice",
    price: 900,
    description: "Perfectly ripe plantain sliced and fried to golden caramelized perfection",
    longDescription:
      "Our Sweet Fried Plantain uses only the ripest, sweetest plantains, sliced and fried in clean oil until they achieve that perfect golden caramelized crust with a tender, almost melting interior. An irresistible side or snack on its own.",
    ingredients: ["Ripe Plantain", "Vegetable Oil", "Pinch of Salt"],
    image:
      "https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&q=80",
    badge: "Side Dish",
    rating: 4.8,
    reviews: 583,
    isBestSeller: true,
    modifiers: [
      { label: "Portion", options: ["Small (5 pieces)", "Medium (8 pieces)", "Large (12 pieces)"] },
    ],
  },
  {
    id: "chicken-grilled",

    name: "Charcoal Grilled Chicken",
    category: "Chicken",
    price: 3500,
    description: "Marinated whole chicken grilled over charcoal with smoky spice rub",
    longDescription:
      "Our Charcoal Grilled Chicken is marinated for 24 hours in a blend of aromatic herbs, spices, and citrus, then slow-grilled over real charcoal to achieve that incredible smoky char on the outside while remaining juicy inside.",
    ingredients: [
      "Whole Chicken",
      "Mixed Herbs",
      "Citrus Marinade",
      "Smoked Paprika",
      "Garlic",
      "Ginger",
      "Scotch Bonnet",
    ],
    image:
      "https://images.unsplash.com/photo-1598103442097-8b74394b95c3?w=800&q=80",
    badge: "Grilled",
    rating: 4.7,
    reviews: 328,
    isPopular: true,
    modifiers: [
      { label: "Cut", options: ["Full Chicken", "Half Chicken", "Quarter Chicken"] },
      { label: "Side", options: ["No Side", "Fried Rice", "Jollof Rice", "Chips"] },
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
    image:
      "https://images.unsplash.com/photo-1601312061560-c0e1bf93a7ea?w=800&q=80",
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
