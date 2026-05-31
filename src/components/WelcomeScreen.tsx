import React, { useState } from "react";
import { useOrderStore } from "../store/useOrderStore";

export const WelcomeScreen: React.FC = () => {
  const setOrderType = useOrderStore((state) => state.setOrderType);
  const [isInteractive, setIsInteractive] = useState<boolean>(false);

  return (
    <div
      onClick={() => {
        if (!isInteractive) setIsInteractive(true);
      }}
      className="min-h-screen w-full bg-brand-dark text-white select-none relative flex flex-col justify-between items-center p-8 sm:p-12 overflow-hidden cursor-pointer"
    >
      {/* AMBIANCES LUMINEUSES */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-amber-900/30 rounded-full blur-[120px] mix-blend-screen animate-drift-slow" />
        <div className="absolute top-1/3 -right-20 w-[450px] h-[450px] bg-stone-500/20 rounded-full blur-[100px] mix-blend-screen animate-drift-reverse" />
      </div>

      {/* ÉTAT A : VEILLE CINÉMATIQUE */}
      {!isInteractive ? (
        <div className="flex-1 w-full flex flex-col justify-between items-center z-10 py-12 animate-fade-in">
          <div />
          <div className="text-center space-y-2 scale-110 sm:scale-125 transition-transform duration-700">
            <h1 className="text-[10rem] sm:text-[13rem] font-meringue tracking-tighter leading-none text-white drop-shadow-2xl">
              Alt.
            </h1>
            <p className="text-3xl sm:text-4xl font-londrina tracking-[0.4em] text-amber-100/80 uppercase pl-[0.4em]">
              Coffee
            </p>
          </div>

          <div className="animate-pulse-slow bg-white/5 border border-white/10 px-8 py-4 rounded-3xl backdrop-blur-sm shadow-xl">
            <p className="font-londrina text-2xl sm:text-3xl uppercase tracking-widest text-center text-amber-50">
              Toucher l'écran pour commander
            </p>
          </div>
        </div>
      ) : (
        // ÉTAT B : SELECTION MODE DE CONSOMMATION
        <div className="flex-1 w-full flex flex-col justify-between items-center z-10 py-6 animate-scale-up">
          <div className="text-center pt-4">
            <h1 className="text-5xl font-meringue tracking-tight leading-none">
              Alt.
            </h1>
            <p className="text-xs font-londrina tracking-widest text-stone-400 uppercase mt-1">
              Coffee Shop
            </p>
          </div>

          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 my-auto px-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
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
          <div className="h-6" />
        </div>
      )}
    </div>
  );
};
