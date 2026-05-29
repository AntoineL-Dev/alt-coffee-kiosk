import React, { useState } from "react";
import { useOrderStore } from "../store/useOrderStore";

export const CustomerNameScreen: React.FC = () => {
  const orderNumber = useOrderStore((state) => state.orderNumber);
  const setCustomerName = useOrderStore((state) => state.setCustomerName);
  const setScreen = useOrderStore((state) => state.setScreen);
  const resetOrder = useOrderStore((state) => state.resetOrder);

  const [inputName, setInputName] = useState<string>("");

  // Configuration des touches du clavier AZERTY
  const KEYBOARD_ROWS = [
    ["A", "Z", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["Q", "S", "D", "F", "G", "H", "J", "K", "L", "M"],
    ["W", "X", "C", "V", "B", "N", "-", "'"],
  ];

  // Gestion des touches du clavier tactile
  const handleKeyPress = (key: string) => {
    if (inputName.length < 12) {
      // Forcer la première lettre en majuscule, le reste en minuscule pour un rendu propre
      if (inputName.length === 0) {
        setInputName(key);
      } else {
        setInputName(inputName + key.toLowerCase());
      }
    }
  };

  const handleBackspace = () => {
    setInputName(inputName.slice(0, -1));
  };

  const handleClear = () => {
    setInputName("");
  };

  const handleSubmit = () => {
    const finalName = inputName.trim() ? inputName.trim() : "L'ami mystère";
    setCustomerName(finalName);
    setScreen("menu");
  };

  return (
    <div className="min-h-screen w-full bg-brand-dark text-white select-none flex flex-col justify-between p-6 sm:p-10 relative overflow-hidden">
      {/* ==========================================
          1. EN-TÊTE & BOUTON RETOUR
         ========================================== */}
      <div className="w-full flex justify-between items-center z-10 shrink-0">
        <button
          onClick={resetOrder}
          className="font-londrina text-lg text-white/40 hover:text-white border border-white/10 px-5 py-2 rounded-2xl cursor-pointer active:scale-95 transition-transform"
        >
          🠔 Annuler
        </button>
        <div className="text-right">
          <span className="font-mono text-xs text-white/30 tracking-widest uppercase block">
            Borne Tactile active
          </span>
          <span className="font-londrina text-xl text-amber-400">
            Commande #{orderNumber}
          </span>
        </div>
      </div>

      {/* ==========================================
          2. ZONE DE PREVIEW DU NOM (Aperçu + Validation)
         ========================================== */}
      <div className="w-full max-w-2xl mx-auto z-10 text-center space-y-6 my-auto py-4">
        <div className="space-y-2">
          <h2 className="font-meringue text-4xl sm:text-5xl text-white leading-tight">
            Quel est votre p'tit nom ?
          </h2>
          <p className="text-xs sm:text-sm text-white/40 font-light max-w-sm mx-auto">
            Il sera imprimé sur votre ticket et appelé au comptoir.
          </p>
        </div>

        {/* Faux champ de saisie pour bloquer le clavier de la tablette */}
        <div className="w-full bg-white/[0.03] border-3 border-white/10 text-center font-londrina text-4xl sm:text-5xl py-5 rounded-3xl min-h-[84px] flex items-center justify-center text-white relative tracking-wide shadow-inner">
          {inputName ? (
            <span>{inputName}</span>
          ) : (
            <span className="opacity-15">Écrivez ici...</span>
          )}
          {/* Curseur clignotant style borne */}
          <span className="animate-pulse ml-1 text-amber-400 font-sans font-light">
            |
          </span>
        </div>

        {/* Bouton de validation principal */}
        <button
          onClick={handleSubmit}
          className="w-full py-4 bg-white text-brand-dark font-londrina text-2xl rounded-2xl shadow-xl active:scale-98 transition-all cursor-pointer block"
        >
          {inputName.trim() ? "C'est parti ! ➔" : "Passer cette étape ➔"}
        </button>
      </div>

      {/* ==========================================
          3. CLAVIER VIRTUEL INTÉGRÉ AU THÈME (Fixe en bas)
         ========================================== */}
      <div className="w-full max-w-3xl mx-auto bg-black/20 border border-white/5 rounded-[2rem] p-4 sm:p-6 space-y-2 sm:space-y-3 z-10 shrink-0 shadow-2xl backdrop-blur-md">
        {/* Lignes de lettres (A-Z) */}
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

            {/* Ajout du bouton Retour Arrière sur la 3ème ligne pour équilibrer */}
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

        {/* Dernière ligne : Touches d'espacement globales */}
        <div className="flex justify-center gap-2 pt-1">
          <button
            onClick={handleClear}
            className="w-24 sm:w-32 h-12 sm:h-14 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white font-londrina text-lg rounded-xl transition-all cursor-pointer shadow-sm"
          >
            Effacer
          </button>

          <button
            onClick={() => handleKeyPress(" ")}
            className="flex-1 h-12 sm:h-14 bg-white/10 hover:bg-white/15 active:bg-white active:text-brand-dark font-londrina text-lg uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-sm text-white/70"
          >
            Espace
          </button>
        </div>
      </div>
    </div>
  );
};
