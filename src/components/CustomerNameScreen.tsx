import React, { useState } from "react";
import { useOrderStore } from "../store/useOrderStore";

export const CustomerNameScreen: React.FC = () => {
  const setCustomerName = useOrderStore((state) => state.setCustomerName);
  const setScreen = useOrderStore((state) => state.setScreen);
  const resetOrder = useOrderStore((state) => state.resetOrder);

  const [inputName, setInputName] = useState<string>("");

  const KEYBOARD_ROWS = [
    ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["Q", "S", "D", "F", "G", "H", "J", "K", "L", "M"],
    ["W", "X", "C", "V", "B", "N", "-", "'"],
  ];

  const handleKeyPress = (key: string) => {
    if (inputName.length < 12) {
      if (inputName.length === 0) setInputName(key);
      else setInputName(inputName + key.toLowerCase());
    }
  };

  const handleBackspace = () => setInputName(inputName.slice(0, -1));
  const handleClear = () => setInputName("");

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputName.trim()) return; // Sécurité de blocage
    setCustomerName(inputName.trim());
    setScreen("menu");
  };

  const isNameEmpty = !inputName.trim();

  return (
    <div className="min-h-screen w-full bg-brand-dark text-white select-none flex flex-col justify-between p-6 sm:p-10 relative overflow-hidden">
      <div className="w-full flex justify-between items-center z-10 shrink-0">
        <button
          onClick={resetOrder}
          className="font-londrina text-lg text-white/40 hover:text-white border border-white/10 px-5 py-2 rounded-2xl cursor-pointer"
        >
          🠔 Annuler
        </button>
      </div>

      <div className="w-full max-w-2xl mx-auto z-10 text-center space-y-6 my-auto py-4">
        <div className="space-y-2">
          <h2 className="font-meringue text-4xl sm:text-5xl text-white leading-tight">
            Quel est votre p'tit nom ?
          </h2>
          <p className="text-xs sm:text-sm text-white/40 font-light max-w-sm mx-auto">
            Il sera imprimé sur votre ticket et appelé au comptoir.
          </p>
        </div>

        {/* FAUX INPUT AVEC CURSEUR DE PROXIMITÉ SERRÉ */}
        <div className="w-full bg-white/[0.03] border-3 border-white/10 text-center font-londrina text-4xl sm:text-5xl py-5 rounded-3xl min-h-[84px] flex items-center justify-center text-white relative tracking-wide shadow-inner">
          {inputName ? (
            <span className="flex items-center justify-center">
              {inputName}
              <span className="inline-block w-[3px] h-8 bg-amber-400 ml-0.5 align-middle animate-pulse" />
            </span>
          ) : (
            <span className="opacity-15 flex items-center justify-center">
              Écrivez ici...
              <span className="inline-block w-[3px] h-8 bg-amber-400 ml-0.5 align-middle animate-pulse" />
            </span>
          )}
        </div>

        {/* BOUTON SAISIE RENDU OBLIGATOIRE (GRISÉ SI VIDE) */}
        <button
          onClick={() => handleSubmit()}
          disabled={isNameEmpty}
          className={`w-full py-4 font-londrina text-2xl rounded-2xl shadow-xl transition-all block ${
            isNameEmpty
              ? "bg-white/5 border border-white/5 text-white/20 cursor-not-allowed shadow-none"
              : "bg-white text-brand-dark active:scale-98 cursor-pointer"
          }`}
        >
          C'est parti ! ➔
        </button>
      </div>

      {/* CLAVIER FIXE AZERTY */}
      <div className="w-full max-w-3xl mx-auto bg-black/20 border border-white/5 rounded-[2rem] p-4 sm:p-6 space-y-2 sm:space-y-3 z-10 shrink-0 shadow-2xl backdrop-blur-md">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1.5 sm:gap-2">
            {row.map((key) => (
              <button
                key={key}
                onClick={() => handleKeyPress(key)}
                className="flex-1 max-w-[64px] aspect-square sm:aspect-auto sm:h-14 bg-white/5 hover:bg-white/10 active:bg-white text-white active:text-brand-dark font-londrina text-xl sm:text-2xl rounded-xl transition-all cursor-pointer flex items-center justify-center shadow-sm"
              >
                {key}
              </button>
            ))}
            {rowIndex === 2 && (
              <button
                onClick={handleBackspace}
                className="flex-1 max-w-[90px] bg-red-500/10 hover:bg-red-500/20 active:bg-red-500 text-red-400 active:text-white font-londrina text-xl rounded-xl transition-all cursor-pointer flex items-center justify-center shadow-sm"
              >
                ⌫
              </button>
            )}
          </div>
        ))}
        <div className="flex justify-center gap-2 pt-1">
          <button
            onClick={handleClear}
            className="w-24 sm:w-32 h-12 sm:h-14 bg-white/5 hover:bg-white/10 text-white/50 font-londrina text-lg rounded-xl cursor-pointer"
          >
            Effacer
          </button>
          <button
            onClick={() => handleKeyPress(" ")}
            className="flex-1 h-12 sm:h-14 bg-white/10 hover:bg-white/15 active:bg-white active:text-brand-dark font-londrina text-lg uppercase tracking-widest rounded-xl cursor-pointer text-white/70"
          >
            Espace
          </button>
        </div>
      </div>
    </div>
  );
};
