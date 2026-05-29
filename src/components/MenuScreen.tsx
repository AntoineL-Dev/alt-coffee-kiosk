import React, { useState } from "react";
import { useOrderStore } from "../store/useOrderStore";
import type { CategoryId } from "../types/menu";
import menuData from "../data/menu.json";

const CATEGORIES: { id: CategoryId; name: string; icon: string }[] = [
  { id: "coffees", name: "K-Fés", icon: "☕" },
  { id: "chocolates", name: "Chauchau", icon: "🥛" },
  { id: "iced_drinks", name: "Givrax", icon: "🥤" },
  { id: "teas", name: "Les T", icon: "🫖" },
];

export const MenuScreen: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("coffees");

  const openCustomizer = useOrderStore((state) => state.openCustomizer);
  const resetOrder = useOrderStore((state) => state.resetOrder);
  const cartCount = useOrderStore((state) => state.getCartCount());
  const cartTotal = useOrderStore((state) => state.getCartTotal());
  const setScreen = useOrderStore((state) => state.setScreen);

  const filteredProducts = menuData.filter(
    (product) => product.category === activeCategory,
  );

  return (
    <div className="min-h-screen flex bg-brand-dark text-white select-none relative">
      {/* ==========================================
          1. BARRE LATÉRALE
         ========================================== */}
      <div className="w-28 sm:w-44 bg-black/20 flex flex-col justify-between py-8 items-center relative z-10 shrink-0">
        {/* Liste verticale des catégories */}
        <div className="w-full flex flex-col items-center gap-4 sm:gap-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`w-24 sm:w-32 flex flex-col items-center justify-center p-2.5 sm:p-4 rounded-2xl transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-white text-brand-dark scale-105 shadow-lg"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="text-2xl sm:text-4xl mb-1">{cat.icon}</span>
              <span className="font-londrina text-base sm:text-xl tracking-wide text-center leading-tight">
                {cat.name}
              </span>
            </button>
          ))}
        </div>

        {/* Bouton Abandonner */}
        <button
          onClick={resetOrder}
          className="w-24 sm:w-32 font-londrina text-sm sm:text-lg border border-white/20 text-white/40 py-2.5 rounded-xl active:bg-red-950/40 active:text-red-400 active:border-red-900/50 transition-colors cursor-pointer"
        >
          Abandonner
        </button>
      </div>

      {/* ==========================================
          2. LIGNE DE SÉPARATION EN VAGUE
         ========================================== */}
      <div className="absolute top-0 bottom-0 left-28 sm:left-44 w-6 sm:w-8 pointer-events-none z-20">
        <svg
          viewBox="0 0 100 1000"
          className="h-full w-full fill-current text-black/20"
          preserveAspectRatio="none"
        >
          <path d="M0,0 C40,120 70,180 40,300 C10,420 80,520 40,650 C0,780 60,880 30,1000 L0,1000 Z" />
        </svg>
      </div>

      {/* ==========================================
          3. GRILLE DE PRODUITS (Correction align-content)
         ========================================== */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden pl-2 sm:pl-6">
        {/* En-tête de catégorie */}
        <div className="p-6 sm:p-8 pt-8 flex justify-between items-center shrink-0">
          <h2 className="font-londrina text-3xl sm:text-6xl tracking-wider uppercase">
            {CATEGORIES.find((c) => c.id === activeCategory)?.name}
          </h2>
          <span className="hidden md:inline text-xs font-mono text-white/30 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full">
            Touchez une boisson pour la configurer
          </span>
        </div>

        {/* AJOUT DE content-start : 
            Cette classe force CSS Grid à compacter les lignes en haut au lieu de les éparpiller verticalement sur la tablette.
        */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 pt-2 grid grid-cols-[repeat(auto-fill,150px)] sm:grid-cols-[repeat(auto-fill,220px)] gap-x-4 sm:gap-x-6 gap-y-4 sm:gap-y-6 content-start pb-36">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => openCustomizer(product as any)}
              className="w-full aspect-square bg-white/[0.03] border-2 border-white/5 hover:border-white/20 active:scale-95 rounded-[1.8rem] sm:rounded-[2.5rem] p-3 pt-9 sm:p-4 sm:pt-12 flex flex-col items-center justify-start text-center relative transition-all shadow-sm cursor-pointer group"
            >
              {/* Étiquette de prix */}
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white text-brand-dark font-londrina text-sm sm:text-xl px-2 py-0.5 sm:px-3 sm:py-0.5 rounded-lg sm:rounded-xl shadow-md transition-transform">
                {product.basePrice.toFixed(2)}€
              </div>

              {/* Icône de la boisson */}
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/5 rounded-full flex items-center justify-center text-xl sm:text-2xl mb-1 sm:mb-2 group-hover:bg-white/10 transition-colors shrink-0">
                {activeCategory === "coffees" && "☕"}
                {activeCategory === "chocolates" && "🍫"}
                {activeCategory === "iced_drinks" && "❄️"}
                {activeCategory === "teas" && "🍃"}
              </div>

              {/* Nom de la boisson */}
              <h3 className="font-meringue text-sm sm:text-lg text-white mb-0.5 px-1 leading-tight shrink-0">
                {product.name}
              </h3>

              {/* Description courte */}
              <p className="text-[10px] sm:text-xs text-white/40 max-w-xs font-light leading-normal px-1 mt-0.5 line-clamp-2 sm:line-clamp-3">
                {product.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* ==========================================
          4. BARRE DE PANIER
         ========================================== */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 right-0 left-0 bg-white text-brand-dark p-4 sm:p-6 border-t-4 border-stone-200 shadow-2xl flex justify-between items-center z-30 animate-fade-in">
          <div className="pl-2 sm:pl-6">
            <p className="font-londrina text-sm sm:text-xl text-brand-dark/40 uppercase tracking-wider">
              Votre plateau
            </p>
            <p className="font-londrina text-xl sm:text-3xl">
              {cartCount} {cartCount > 1 ? "articles" : "article"} ·{" "}
              <span className="font-sans font-bold">
                {cartTotal.toFixed(2)} €
              </span>
            </p>
          </div>
          <button
            onClick={() => setScreen("cart")}
            className="bg-brand-dark text-white font-londrina text-lg sm:text-2xl px-6 py-2.5 sm:px-12 sm:py-4 rounded-xl sm:rounded-2xl active:scale-95 transition-transform shadow-md cursor-pointer"
          >
            Finaliser ma commande ➔
          </button>
        </div>
      )}
    </div>
  );
};
