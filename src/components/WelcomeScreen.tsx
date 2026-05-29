import React, { useState } from "react";
import { useOrderStore } from "../store/useOrderStore";

export const WelcomeScreen: React.FC = () => {
  const setOrderType = useOrderStore((state) => state.setOrderType);

  // false = Écran de veille publicitaire / true = Choix du mode de consommation
  const [isInteractive, setIsInteractive] = useState<boolean>(false);

  return (
    <div
      onClick={() => {
        if (!isInteractive) setIsInteractive(true);
      }}
      className="min-h-screen w-full bg-brand-dark text-white select-none relative flex flex-col justify-between items-center p-8 sm:p-12 overflow-hidden cursor-pointer"
    >
      {/* ==========================================
          FONDS LUMINEUX CINÉMATIQUES (Atmosphère Café)
         ========================================== */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Halo ambré chaud en haut à gauche */}
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-amber-900/30 rounded-full blur-[120px] mix-blend-screen animate-drift-slow" />
        {/* Halo craie/vapeur au centre droit */}
        <div className="absolute top-1/3 -right-20 w-[450px] h-[450px] bg-stone-500/20 rounded-full blur-[100px] mix-blend-screen animate-drift-reverse" />
      </div>

      {/* ==========================================
          ÉTAT A : L'ATTRACT LOOP (Écran de Veille)
         ========================================== */}
      {!isInteractive ? (
        <div className="flex-1 w-full flex flex-col justify-between items-center z-10 py-12 animate-fade-in">
          <div /> {/* Espacement */}
          {/* Bloc Logo Géant Artistique */}
          <div className="text-center space-y-2 scale-110 sm:scale-125 transition-transform duration-700">
            <h1 className="text-[10rem] sm:text-[13rem] font-meringue tracking-tighter leading-none text-white drop-shadow-2xl">
              Alt.
            </h1>
            <p className="text-3xl sm:text-4xl font-londrina tracking-[0.4em] text-amber-100/80 uppercase pl-[0.4em]">
              Coffee
            </p>
          </div>
          {/* Invite à toucher clignotante */}
          <div className="animate-pulse-slow bg-white/5 border border-white/10 px-8 py-4 rounded-3xl backdrop-blur-sm shadow-xl">
            <p className="font-londrina text-2xl sm:text-3xl uppercase tracking-widest text-center text-amber-50">
              Toucher l'écran pour commander
            </p>
          </div>
        </div>
      ) : (
        // ==========================================
        // ÉTAT B : LE MENU DE CONSOMMATION INTERACTIF
        // ==========================================
        <div className="flex-1 w-full flex flex-col justify-between items-center z-10 py-6 animate-scale-up">
          {/* En-tête réduit pour laisser place aux boutons */}
          <div className="text-center pt-4">
            <h1 className="text-5xl font-meringue tracking-tight leading-none">
              Alt.
            </h1>
            <p className="text-xs font-londrina tracking-widest text-stone-400 uppercase mt-1">
              Coffee Shop Kiosk
            </p>
          </div>

          {/* Les Deux Grosses Cartes d'Option */}
          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 my-auto px-4">
            {/* Option Sur Place */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // Évite les conflits de clic avec le fond
                setOrderType("dine_in");
              }}
              className="active:scale-98 bg-white/[0.02] hover:bg-white/[0.04] border-2 border-white/10 hover:border-amber-200/50 rounded-[2.5rem] p-10 flex flex-col justify-center items-center gap-6 min-h-[300px] shadow-xl transition-all group cursor-pointer"
            >
              <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                ☕
              </span>
              <div className="text-center space-y-1">
                <span className="block text-4xl font-londrina tracking-wide text-white">
                  Sur place
                </span>
                <span className="text-xs text-amber-200/40 font-mono uppercase tracking-widest block">
                  Servi sur un joli plateau
                </span>
              </div>
            </button>

            {/* Option À Emporter */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOrderType("take_away");
              }}
              className="active:scale-98 bg-white/[0.02] hover:bg-white/[0.04] border-2 border-white/10 hover:border-amber-200/50 rounded-[2.5rem] p-10 flex flex-col justify-center items-center gap-6 min-h-[300px] shadow-xl transition-all group cursor-pointer"
            >
              <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                🛍️
              </span>
              <div className="text-center space-y-1">
                <span className="block text-4xl font-londrina tracking-wide text-white">
                  À emporter
                </span>
                <span className="text-xs text-amber-200/40 font-mono uppercase tracking-widest block">
                  Dans un sac prêt à glisser
                </span>
              </div>
            </button>
          </div>

          {/* Bouton discret pour ré-enclencher la veille si besoin */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsInteractive(false);
            }}
            className="text-xs font-mono text-white/20 uppercase tracking-wider hover:text-white/40 pb-2 cursor-pointer"
          >
            ➔ Retour à l'écran de veille
          </button>
        </div>
      )}
    </div>
  );
};
