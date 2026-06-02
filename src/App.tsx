import React, { useEffect, useState, useRef } from "react";
import { useOrderStore } from "./store/useOrderStore";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { CustomerNameScreen } from "./components/CustomerNameScreen";
import { MenuScreen } from "./components/MenuScreen";
import { CustomizerScreen } from "./components/CustomizerScreen";
import { CartScreen } from "./components/CartScreen";
import { CheckoutScreen } from "./components/CheckoutScreen";

export const App: React.FC = () => {
  const currentScreen = useOrderStore((state) => state.currentScreen);
  const resetOrder = useOrderStore((state) => state.resetOrder);

  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [timeoutCountdown, setTimeoutCountdown] = useState(30);

  /* CORRECTION ICI : Utilisation du type natif dynamique pour éviter le namespace NodeJS */
  const activityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fonction de réinitialisation du minuteur d'inactivité
  const resetActivityTimer = () => {
    if (showTimeoutModal) return; // Ne pas réinitialiser si la pop-up est déjà là
    if (activityTimerRef.current) clearTimeout(activityTimerRef.current);

    // On ne lance le minuteur que si on a quitté l'écran de veille initial
    if (currentScreen !== "welcome") {
      activityTimerRef.current = setTimeout(() => {
        setShowTimeoutModal(true);
        setTimeoutCountdown(30);
      }, 120000); // 2 minutes d'inactivité
    }
  };

  // Écoute les interactions utilisateur sur toute la fenêtre
  useEffect(() => {
    resetActivityTimer();
    window.addEventListener("click", resetActivityTimer);
    window.addEventListener("touchstart", resetActivityTimer);

    return () => {
      if (activityTimerRef.current) clearTimeout(activityTimerRef.current);
      window.removeEventListener("click", resetActivityTimer);
      window.removeEventListener("touchstart", resetActivityTimer);
    };
  }, [currentScreen, showTimeoutModal]);

  // Gère le compte à rebours des 30 secondes de la pop-up
  useEffect(() => {
    if (showTimeoutModal) {
      countdownTimerRef.current = setInterval(() => {
        setTimeoutCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownTimerRef.current!);
            setShowTimeoutModal(false);
            resetOrder(); // Efface tout et renvoie à l'accueil
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    }

    return () => {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, [showTimeoutModal, resetOrder]);

  return (
    <div className="relative w-full min-h-screen bg-brand-dark">
      {/* RENDER DES ÉCRANS STANDARD */}
      {(() => {
        switch (currentScreen) {
          case "welcome":
            return <WelcomeScreen />;
          case "customer_name":
            return <CustomerNameScreen />;
          case "menu":
            return <MenuScreen />;
          case "customizer":
            return <CustomizerScreen />;
          case "cart":
            return <CartScreen />;
          case "checkout":
            return <CheckoutScreen />;
          default:
            return <div className="text-white p-8">Écran introuvable</div>;
        }
      })()}

      {/* POP-UP INTERNE DE TIMEOUT D'INACTIVITÉ */}
      {showTimeoutModal && (
        <div 
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none" 
          onClick={() => setShowTimeoutModal(false)}
        >
          <div className="bg-white text-brand-dark max-w-md w-full p-8 rounded-[2.5rem] text-center space-y-6 shadow-2xl animate-scale-up">
            <h3 className="font-meringue text-3xl text-brand-dark">
              Êtes-vous toujours là ?
            </h3>
            <p className="text-sm text-brand-dark/60 font-light leading-relaxed">
              Sans action de votre part, la commande sera annulée pour libérer
              l'accès aux clients suivants.
            </p>
            <div className="font-londrina text-6xl text-amber-800 animate-pulse py-2">
              {timeoutCountdown}s
            </div>
            <button
              onClick={() => setShowTimeoutModal(false)}
              className="w-full py-4 bg-brand-dark hover:bg-brand-dark/95 text-white font-londrina text-2xl rounded-2xl shadow-md cursor-pointer active:scale-98 transition-transform"
            >
              Continuer la commande
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
