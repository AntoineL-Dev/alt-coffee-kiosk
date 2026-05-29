import React from "react";
import { useOrderStore } from "./store/useOrderStore";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { CustomerNameScreen } from "./components/CustomerNameScreen"; // Nouveau
import { MenuScreen } from "./components/MenuScreen";
import { CustomizerScreen } from "./components/CustomizerScreen";
import { CartScreen } from "./components/CartScreen";
import { CheckoutScreen } from "./components/CheckoutScreen";

export const App: React.FC = () => {
  const currentScreen = useOrderStore((state) => state.currentScreen);

  switch (currentScreen) {
    case "welcome":
      return <WelcomeScreen />;

    case "customer_name":
      return <CustomerNameScreen />; // Intégration de la saisie du nom

    case "menu":
      return <MenuScreen />;

    case "customizer":
      return <CustomizerScreen />;

    case "cart":
      return <CartScreen />;

    case "checkout":
      return <CheckoutScreen />;

    default:
      return (
        <div className="min-h-screen flex items-center justify-center bg-brand-dark text-white">
          <p className="font-londrina text-xl">Erreur : Écran introuvable</p>
        </div>
      );
  }
};

export default App;
