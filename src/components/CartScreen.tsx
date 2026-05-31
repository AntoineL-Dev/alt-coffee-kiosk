import React, { useState } from "react";
import { useOrderStore } from "../store/useOrderStore";

export const CartScreen: React.FC = () => {
  const cart = useOrderStore((state) => state.cart);
  const orderType = useOrderStore((state) => state.orderType);
  const customerName = useOrderStore((state) => state.customerName);
  const updateQuantity = useOrderStore((state) => state.updateQuantity);
  const removeFromCart = useOrderStore((state) => state.removeFromCart);
  const openCustomizer = useOrderStore((state) => state.openCustomizer);
  const setScreen = useOrderStore((state) => state.setScreen);
  const resetOrder = useOrderStore((state) => state.resetOrder);
  const cartTotal = useOrderStore((state) => state.getCartTotal());

  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);

  const calculateItemUnitPrice = (item: (typeof cart)[0]) => {
    const sizePrice = item.selectedSize.price;
    const milkPrice = item.selectedMilk?.price || 0;
    const texturePrice = item.selectedMilkTexture?.price || 0;
    const toppingsPrice = item.selectedToppings.reduce(
      (sum, t) => sum + t.price,
      0,
    );
    return (
      item.product.basePrice +
      sizePrice +
      milkPrice +
      texturePrice +
      toppingsPrice
    );
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-brand-dark text-white flex flex-col justify-center items-center p-8 select-none">
        <h2 className="font-londrina text-5xl mb-4">Votre commande est vide</h2>
        <button
          onClick={() => setScreen("menu")}
          className="bg-white text-brand-dark font-londrina text-2xl px-8 py-4 rounded-2xl cursor-pointer shadow-md"
        >
          Retourner au catalogue
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white p-6 sm:p-12 select-none flex flex-col justify-between h-screen overflow-hidden">
      {/* EN-TÊTE CORRIGÉ */}
      <div className="flex justify-between items-end border-b border-white/10 pb-6 shrink-0">
        <div>
          <h2 className="font-londrina text-5xl tracking-wide uppercase">
            Vérifiez votre commande
          </h2>
          <p className="text-amber-400 font-mono text-sm uppercase tracking-wider mt-1">
            Commande pour{" "}
            <span className="text-white font-bold">{customerName}</span> ·{" "}
            <span className="text-white/60">
              {orderType === "dine_in" ? "Sur place ☕" : "À emporter 🛍️"}
            </span>
          </p>
        </div>
        <button
          onClick={() => setShowCancelModal(true)}
          className="font-londrina text-lg text-red-400/70 border border-red-900/30 px-4 py-2 rounded-xl hover:bg-red-950/20 cursor-pointer"
        >
          Tout annuler
        </button>
      </div>

      {/* ZONE DES ARTICLES */}
      <div className="flex-1 overflow-y-auto my-6 space-y-4 pr-2">
        {cart.map((item, index) => {
          const unitPrice = calculateItemUnitPrice(item);

          return (
            <div
              key={`${item.product.id}-${index}`}
              className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-baseline gap-3">
                  <h3 className="font-meringue text-2xl text-white">
                    {item.product.name}
                  </h3>
                  <span className="font-londrina text-sm text-white/40 uppercase tracking-wider">
                    ({item.selectedSize.name})
                  </span>
                </div>

                <div className="text-xs font-mono text-white/50 space-y-0.5">
                  {item.selectedMilk && (
                    <p>· Lait : {item.selectedMilk.name}</p>
                  )}
                  {item.selectedMilkTexture && (
                    <p>· Mousse : {item.selectedMilkTexture.name}</p>
                  )}
                  {item.selectedToppings.length > 0 && (
                    <p>
                      · Toppings :{" "}
                      {item.selectedToppings.map((t) => t.name).join(", ")}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => openCustomizer(item.product, index)}
                  className="inline-block mt-3 font-londrina text-sm text-amber-500/80 border border-amber-900/40 bg-amber-950/10 px-4 py-1.5 rounded-xl cursor-pointer"
                >
                  ✏️ Modifier la recette
                </button>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-8 w-full md:w-auto border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                <div className="flex items-center bg-white/5 rounded-2xl p-1 border border-white/5">
                  <button
                    onClick={() => {
                      if (item.quantity === 1) removeFromCart(index);
                      else updateQuantity(index, -1);
                    }}
                    className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/5 cursor-pointer text-white/70"
                  >
                    {item.quantity === 1 ? (
                      /* ICÔNE DE SUPPRESSION SVG À LA PLACE DE L'ÉMOJI CORBEILLE */
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className="w-5 h-5 text-red-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    ) : (
                      "−"
                    )}
                  </button>
                  <span className="w-10 text-center font-londrina text-2xl">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(index, 1)}
                    className="w-12 h-12 flex items-center justify-center font-bold text-xl rounded-xl hover:bg-white/5 cursor-pointer text-white/70"
                  >
                    +
                  </button>
                </div>

                <div className="text-right min-w-[90px]">
                  <p className="font-londrina text-2xl">
                    {(unitPrice * item.quantity).toFixed(2)}€
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER AVEC RETOUR PROPRE AU MENU DE BASE */}
      <div className="bg-white text-brand-dark p-6 rounded-[2.5rem] shadow-2xl flex flex-col sm:flex-row justify-between items-center gap-6 shrink-0">
        <div className="text-center sm:text-left pl-2">
          <span className="font-londrina text-lg text-brand-dark/40 uppercase tracking-wider block">
            Total à régler
          </span>
          <span className="font-londrina text-4xl sm:text-5xl">
            {cartTotal.toFixed(2)} €
          </span>
        </div>

        <div className="flex gap-4 w-full sm:w-auto">
          <button
            onClick={() => setScreen("menu")}
            className="flex-1 sm:flex-initial px-8 py-4 border-2 border-brand-dark/10 text-brand-dark font-londrina text-xl rounded-2xl cursor-pointer bg-transparent active:scale-98 transition-transform"
          >
            Ajouter une boisson
          </button>
          <button
            onClick={() => setScreen("checkout")}
            className="flex-1 sm:flex-initial px-12 py-4 bg-brand-dark text-white font-londrina text-2xl rounded-2xl shadow-lg cursor-pointer active:scale-98 transition-transform"
          >
            Passer au paiement ➔
          </button>
        </div>
      </div>

      {/* POP-UP CONFIRMATION TOUT ANNULER */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white text-brand-dark max-w-sm w-full p-6 rounded-3xl text-center space-y-5 shadow-2xl animate-scale-up">
            <h4 className="font-londrina text-2xl uppercase tracking-wide">
              Tout vider ?
            </h4>
            <p className="text-sm text-brand-dark/60 font-light">
              Votre commande complète va être effacée et vous reviendrez au
              début.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="py-2.5 border-2 border-brand-dark/10 font-londrina rounded-xl text-lg cursor-pointer"
              >
                Retour
              </button>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  resetOrder();
                }}
                className="py-2.5 bg-red-600 text-white font-londrina rounded-xl text-lg cursor-pointer"
              >
                Oui, tout effacer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
