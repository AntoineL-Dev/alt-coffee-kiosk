export type CategoryId = "coffees" | "teas" | "chocolates" | "iced_drinks";
export type OrderType = "dine_in" | "take_away";

export interface MenuOption {
  name: string;
  price: number;
}

// ==========================================
// CONSTANTES GLOBALES
// ==========================================

export const AVAILABLE_MILKS: MenuOption[] = [
  { name: "Lait entier", price: 0.0 },
  { name: "Lait avoine", price: 0.6 },
];

export const AVAILABLE_TOPPINGS: MenuOption[] = [
  { name: "Coulis framboise", price: 0.5 },
  { name: "Coulis caramel", price: 0.5 },
  { name: "Poudre cacao", price: 0.3 },
  { name: "Chantilly", price: 0.7 },
  { name: "Sirop framboise", price: 0.5 },
  { name: "Sirop caramel", price: 0.5 },
  { name: "Sirop vanille", price: 0.5 },
];

export const AVAILABLE_MILK_TEXTURES: MenuOption[] = [
  { name: "Classique", price: 0.0 },
  { name: "Nuage (mousse ferme)", price: 0.0 },
  { name: "Soie (micro-mousse, latté-art)", price: 0.0 },
  { name: "Froid (Cold Foam)", price: 0.5 },
];

// ==========================================
// STRUCTURES DES MODÈLES (Contrats)
// ==========================================

export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  category: CategoryId;
  image?: string;

  customization: {
    requiresMilk: boolean;
    allowsMilkTexture: boolean;
    allowsToppings: boolean;
    sizes: MenuOption[];
  };
}

export interface CartItem {
  product: Product;
  selectedSize: MenuOption;
  selectedMilk?: MenuOption;
  selectedMilkTexture?: MenuOption;
  selectedToppings: MenuOption[];
  quantity: number;
}
