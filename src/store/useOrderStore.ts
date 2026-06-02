import { create } from "zustand";
import type {
  CartItem,
  Product,
  OrderType,
  CategoryId,
} from "../types/menu";

export type ScreenId =
  | "welcome"
  | "customer_name"
  | "menu"
  | "customizer"
  | "cart"
  | "checkout";

interface OrderState {
  orderType: OrderType | null;
  currentScreen: ScreenId;
  cart: CartItem[];
  activeProduct: Product | null;
  editingCartIndex: number | null;
  customerName: string; // Nouveau
  orderNumber: string; // Nouveau
  activeCategory: CategoryId;

  setOrderType: (type: OrderType) => void;
  setCustomerName: (name: string) => void; // Nouveau
  setScreen: (screen: ScreenId) => void;
  setActiveCategory: (category: CategoryId) => void;
  openCustomizer: (product: Product, index?: number | null) => void;
  addToCart: (item: Omit<CartItem, "quantity"> & { quantity: number }) => void;
  updateCartItem: (index: number, updatedItem: CartItem) => void;
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, delta: number) => void;
  resetOrder: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orderType: null,
  currentScreen: "welcome",
  cart: [],
  activeProduct: null,
  editingCartIndex: null,
  customerName: "",
  orderNumber: "",
  activeCategory: "coffees",

  setOrderType: (type) =>
    set({
      orderType: type,
      currentScreen: "customer_name", // Redirection vers l'écran de saisie du nom !
      orderNumber: String(Math.floor(Math.random() * 899) + 100), // Génère un numéro de 100 à 999
    }),

  setCustomerName: (name) => set({ customerName: name }),

  setScreen: (screen) => set({ currentScreen: screen }),

  setActiveCategory: (category) => set({ activeCategory: category }),

  openCustomizer: (product, index = null) =>
    set({
      activeProduct: product,
      editingCartIndex: index,
      currentScreen: "customizer",
    }),

  addToCart: (newItem) =>
    set((state) => {
      const existingItemIndex = state.cart.findIndex(
        (item) =>
          item.product.id === newItem.product.id &&
          item.selectedSize.name === newItem.selectedSize.name &&
          item.selectedMilk?.name === newItem.selectedMilk?.name &&
          item.selectedMilkTexture?.name ===
            newItem.selectedMilkTexture?.name &&
          item.selectedToppings.length === newItem.selectedToppings.length &&
          item.selectedToppings.every((t) =>
            newItem.selectedToppings.some((nt) => nt.name === t.name),
          ),
      );

      if (existingItemIndex > -1) {
        const updatedCart = [...state.cart];
        updatedCart[existingItemIndex].quantity += newItem.quantity;
        return {
          cart: updatedCart,
          currentScreen: "menu",
          activeProduct: null,
          editingCartIndex: null,
        };
      }

      return {
        cart: [...state.cart, newItem as CartItem],
        currentScreen: "menu",
        activeProduct: null,
        editingCartIndex: null,
      };
    }),

  updateCartItem: (index, updatedItem) =>
    set((state) => {
      const updatedCart = [...state.cart];
      updatedCart[index] = updatedItem;
      return {
        cart: updatedCart,
        currentScreen: "cart",
        activeProduct: null,
        editingCartIndex: null,
      };
    }),

  removeFromCart: (index) =>
    set((state) => ({
      cart: state.cart.filter((_, i) => i !== index),
    })),

  updateQuantity: (index, delta) =>
    set((state) => {
      const updatedCart = state.cart.map((item, i) => {
        if (i === index) {
          const newQuantity = item.quantity + delta;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      });
      return { cart: updatedCart };
    }),

  resetOrder: () =>
    set({
      orderType: null,
      currentScreen: "welcome",
      cart: [],
      activeProduct: null,
      editingCartIndex: null,
      customerName: "",
      orderNumber: "",
    }),

  getCartTotal: () => {
    return get().cart.reduce((total, item) => {
      const sizePrice = item.selectedSize.price;
      const milkPrice = item.selectedMilk?.price || 0;
      const texturePrice = item.selectedMilkTexture?.price || 0;
      const toppingsPrice = item.selectedToppings.reduce(
        (sum, t) => sum + t.price,
        0,
      );

      const itemUnitRoute =
        item.product.basePrice +
        sizePrice +
        milkPrice +
        texturePrice +
        toppingsPrice;
      return total + itemUnitRoute * item.quantity;
    }, 0);
  },

  getCartCount: () => {
    return get().cart.reduce((count, item) => count + item.quantity, 0);
  },
}));
