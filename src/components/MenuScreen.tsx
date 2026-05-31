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
  const [showAbandonModal, setShowAbandonModal] = useState<boolean>(false);

  const openCustomizer = useOrderStore((state) => state.openCustomizer);
  const resetOrder = useOrderStore((state) => state.resetOrder);
  const cartCount = useOrderStore((state) => state.getCartCount());
  const cartTotal = useOrderStore((state) => state.getCartTotal());
  const setScreen = useOrderStore((state) => state.setScreen);

  const filteredProducts = menuData.filter(
    (product) => product.category === activeCategory,
  );

  return (
    <div className="min-h-screen flex bg-brand-dark text-white select-none relative h-screen overflow-hidden">
      {/* 1. BARRE LATÉRALE */}
      <div className="w-28 sm:w-44 bg-black/20 flex flex-col justify-between py-8 items-center relative z-10 shrink-0 h-full">
        <div className="flex-1 w-full flex flex-col justify-center items-center gap-4 sm:gap-6 overflow-y-auto my-4 px-2 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`w-24 sm:w-32 flex flex-col items-center justify-center p-2.5 sm:p-4 rounded-2xl transition-all cursor-pointer shrink-0 ${
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

        <button
          onClick={() => setShowAbandonModal(true)}
          className="w-24 sm:w-32 font-londrina text-sm sm:text-lg border border-white/20 text-white/40 py-2.5 rounded-xl transition-colors cursor-pointer shrink-0 hover:bg-red-950/20 hover:text-red-400"
        >
          Abandonner
        </button>
      </div>

      {/* 2. SÉPARATION EN VAGUE */}
      <div className="absolute top-0 bottom-0 left-28 sm:left-44 w-6 sm:w-8 pointer-events-none z-20">
        <svg
          viewBox="0 0 100 1000"
          className="h-full w-full fill-current text-black/20"
          preserveAspectRatio="none"
        >
          <path d="M0,0 C40,120 70,180 40,300 C10,420 80,520 40,650 C0,780 60,880 30,1000 L0,1000 Z" />
        </svg>
      </div>

      {/* 3. GRILLE DE PRODUITS AVEC INTEGRATION DES VISUELS */}
      <div className="flex-1 flex flex-col h-full overflow-hidden pl-2 sm:pl-6">
        <div className="p-6 sm:p-8 pt-8 flex justify-between items-center shrink-0">
          <h2 className="font-londrina text-3xl sm:text-6xl tracking-wider uppercase">
            {CATEGORIES.find((c) => c.id === activeCategory)?.name}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8 pt-2 grid grid-cols-[repeat(auto-fill,150px)] sm:grid-cols-[repeat(auto-fill,220px)] gap-x-4 sm:gap-x-6 gap-y-4 sm:gap-y-6 content-start pb-36">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => openCustomizer(product as any)}
              /* AJUSTEMENT : Remplacement du p-3 pt-9 par un p-3 pt-4 plus équilibré pour le haut de l'image */
              className="w-full aspect-square bg-white/[0.03] border-2 border-white/5 hover:border-white/20 active:scale-95 rounded-[1.8rem] sm:rounded-[2.5rem] p-3 pt-4 sm:p-4 sm:pt-6 flex flex-col items-center justify-start text-center relative transition-all shadow-sm cursor-pointer group"
            >
              {/* Étiquette de prix (Reste absolue et passe au premier plan au-dessus du visuel) */}
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white text-brand-dark font-londrina text-xs sm:text-lg px-2 py-0.5 rounded-lg shadow-md z-10">
                {product.basePrice.toFixed(2)}€
              </div>

              {/* NOUVEL ACCORDÉON VISUEL : 
                  Prend le haut + centre supérieur. Intègre une image avec un fallback émoji automatique 
                  si le fichier n'existe pas encore dans public/ ! */}
              <div className="w-full h-16 sm:h-24 mb-1 sm:mb-2 flex items-center justify-center overflow-hidden shrink-0 relative">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // Si l'image n'est pas trouvée (404), on cache la balise cassée et on affiche l'émoji de secours
                      e.currentTarget.style.display = "none";
                      const fallback = e.currentTarget
                        .nextElementSibling as HTMLDivElement;
                      if (fallback) fallback.style.display = "flex";
                    }}
                  />
                ) : null}

                {/* Émoji de secours masqué par défaut, s'active si l'image crash */}
                <div
                  className="absolute inset-0 items-center justify-center text-3xl sm:text-4xl bg-white/5 rounded-full w-12 h-12 sm:w-16 sm:h-16 mx-auto"
                  style={{ display: product.image ? "none" : "flex" }}
                >
                  {activeCategory === "coffees" && "☕"}
                  {activeCategory === "chocolates" && "🍫"}
                  {activeCategory === "iced_drinks" && "❄️"}
                  {activeCategory === "teas" && "🍃"}
                </div>
              </div>

              {/* Nom de la boisson */}
              <h3 className="font-meringue text-xs sm:text-base text-white mb-0.5 px-1 leading-tight shrink-0 w-full truncate">
                {product.name}
              </h3>

              {/* Description courte */}
              <p className="text-[9px] sm:text-[11px] text-white/40 max-w-xs font-light leading-snug px-1 mt-0.5 line-clamp-2 sm:line-clamp-2">
                {product.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* 4. COMPTOIR DE LA COMMANDE */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 right-0 left-0 bg-white text-brand-dark p-4 sm:p-6 border-t-4 border-stone-200 shadow-2xl flex justify-between items-center z-30 animate-fade-in">
          <div className="pl-2 sm:pl-6">
            <p className="font-londrina text-sm sm:text-xl text-brand-dark/40 uppercase tracking-wider">
              Votre commande
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
            Voir ma commande ➔
          </button>
        </div>
      )}

      {/* POP-UP CONFIRMATION ABANDON */}
      {showAbandonModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white text-brand-dark max-w-sm w-full p-6 rounded-3xl text-center space-y-5 shadow-2xl animate-scale-up">
            <h4 className="font-londrina text-2xl uppercase tracking-wide">
              Abandonner la commande ?
            </h4>
            <p className="text-sm text-brand-dark/60 font-light">
              Tous vos articles actuels seront effacés du plateau.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowAbandonModal(false)}
                className="py-2.5 border-2 border-brand-dark/10 font-londrina rounded-xl text-lg cursor-pointer"
              >
                Continuer
              </button>
              <button
                onClick={() => {
                  setShowAbandonModal(false);
                  resetOrder();
                }}
                className="py-2.5 bg-red-600 text-white font-londrina rounded-xl text-lg cursor-pointer"
              >
                Oui, abandonner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
