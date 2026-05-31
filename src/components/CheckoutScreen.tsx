import React, { useEffect, useState } from "react";
import { useOrderStore } from "../store/useOrderStore";

export const CheckoutScreen: React.FC = () => {
  const cartTotal = useOrderStore((state) => state.getCartTotal());
  const resetOrder = useOrderStore((state) => state.resetOrder);
  const setScreen = useOrderStore((state) => state.setScreen);
  const orderNumber = useOrderStore((state) => state.orderNumber);
  const customerName = useOrderStore((state) => state.customerName);

  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "processing" | "success"
  >("pending");

  // CORRECTION CHRONO : Passage à 20 secondes avant réinitialisation
  const [countdown, setCountdown] = useState<number>(20);

  const handleSimulatePayment = () => {
    setPaymentStatus("processing");
    setTimeout(() => {
      setPaymentStatus("success");
    }, 2500);
  };

  useEffect(() => {
    if (paymentStatus !== "success") return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          resetOrder();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [paymentStatus, resetOrder]);

  return (
    <div className="min-h-screen bg-brand-dark text-white p-6 flex flex-col items-center justify-center select-none">
      {/* CASE 1 : ATTENTE DE LA CARTE (NUMÉRO MASQUÉ ICI) */}
      {paymentStatus === "pending" && (
        <div className="w-full max-w-md bg-white text-brand-dark rounded-[2.5rem] p-8 text-center shadow-2xl space-y-8 animate-fade-in">
          <div>
            <span className="font-londrina text-sm text-brand-dark/40 uppercase tracking-widest block mb-1">
              Finalisation
            </span>
            <h2 className="font-londrina text-4xl uppercase tracking-wide">
              Paiement par carte
            </h2>
            <p className="font-sans font-bold text-3xl text-amber-800 mt-4">
              {cartTotal.toFixed(2)} €
            </p>
          </div>

          <button
            onClick={handleSimulatePayment}
            className="w-full aspect-video border-4 border-dashed border-brand-dark/20 hover:border-brand-dark/40 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer group active:scale-98 transition-all bg-brand-dark/[0.01]"
          >
            <span className="text-5xl group-hover:animate-pulse">💳</span>
            <span className="font-londrina text-lg text-brand-dark/60">
              Posez ou insérez votre carte
            </span>
          </button>

          <button
            onClick={() => setScreen("cart")}
            className="w-full py-3 border border-brand-dark/10 hover:bg-brand-dark/5 text-brand-dark/60 font-londrina text-lg rounded-xl cursor-pointer"
          >
            Retour à la commande
          </button>
        </div>
      )}

      {/* CASE 2 : CALCULS BANCAIRES */}
      {paymentStatus === "processing" && (
        <div className="w-full max-w-md bg-white text-brand-dark rounded-[2.5rem] p-12 text-center shadow-2xl flex flex-col items-center justify-center gap-6 animate-pulse">
          <div className="w-16 h-16 border-4 border-brand-dark border-t-transparent rounded-full animate-spin"></div>
          <div className="space-y-1">
            <h2 className="font-londrina text-3xl uppercase tracking-wide">
              Communication...
            </h2>
            <p className="text-sm text-brand-dark/50 font-light">
              Autorisation bancaire en cours, patientez.
            </p>
          </div>
        </div>
      )}

      {/* CASE 3 : PAIEMENT RÉUSSI (AFFICHE ENFIN LE NUMÉRO ICI) */}
      {paymentStatus === "success" && (
        <div className="w-full max-w-xl text-center space-y-8 animate-scale-up">
          <div className="w-24 h-24 bg-white text-brand-dark rounded-full flex items-center justify-center text-5xl mx-auto shadow-lg shadow-black/20">
            ✓
          </div>

          <div className="space-y-2">
            <h1 className="font-meringue text-4xl sm:text-6xl text-white">
              Merci pour vos p'tits sous, {customerName} !
            </h1>
            <h2 className="font-londrina text-4xl text-amber-400 tracking-wider uppercase pt-2">
              Commande n°{orderNumber} en cuisine
            </h2>
          </div>

          <p className="text-sm text-white/40 max-w-md mx-auto font-light leading-relaxed">
            Prenez votre ticket imprimé sous l'écran. Votre boisson Alt. Coffee
            sera prête au comptoir dans quelques instants.
          </p>

          <div className="inline-block bg-white/5 border border-white/10 px-6 py-2 rounded-full text-xs font-mono text-white/50 tracking-wider">
            Retour à l'accueil automatique dans{" "}
            <span className="text-white font-bold font-sans text-sm">
              {countdown}s
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
