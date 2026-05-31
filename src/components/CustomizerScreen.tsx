import React, { useState } from "react";
import { useOrderStore } from "../store/useOrderStore";
import {
  AVAILABLE_MILKS,
  AVAILABLE_MILK_TEXTURES,
  AVAILABLE_TOPPINGS,
  type MenuOption,
} from "../types/menu";

export const CustomizerScreen: React.FC = () => {
  const activeProduct = useOrderStore((state) => state.activeProduct);
  const editingCartIndex = useOrderStore((state) => state.editingCartIndex);
  const cart = useOrderStore((state) => state.cart);

  const addToCart = useOrderStore((state) => state.addToCart);
  const updateCartItem = useOrderStore((state) => state.updateCartItem);
  const setScreen = useOrderStore((state) => state.setScreen);

  if (!activeProduct) return null;

  const isEditing = editingCartIndex !== null;
  const existingItem = isEditing ? cart[editingCartIndex] : null;
  const hasToppings = activeProduct.customization.allowsToppings;

  const [selectedSize, setSelectedSize] = useState<MenuOption>(
    existingItem
      ? existingItem.selectedSize
      : activeProduct.customization.sizes[0],
  );

  const [selectedMilk, setSelectedMilk] = useState<MenuOption | undefined>(
    existingItem
      ? existingItem.selectedMilk
      : activeProduct.customization.requiresMilk
        ? AVAILABLE_MILKS[0]
        : undefined,
  );

  const [selectedMilkTexture, setSelectedMilkTexture] = useState<
    MenuOption | undefined
  >(
    existingItem
      ? existingItem.selectedMilkTexture
      : activeProduct.customization.allowsMilkTexture
        ? AVAILABLE_MILK_TEXTURES[0]
        : undefined,
  );

  const [selectedToppings, setSelectedToppings] = useState<MenuOption[]>(
    existingItem ? existingItem.selectedToppings : [],
  );

  const toggleTopping = (topping: MenuOption) => {
    if (selectedToppings.some((t) => t.name === topping.name)) {
      setSelectedToppings(
        selectedToppings.filter((t) => t.name !== topping.name),
      );
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const calculateCurrentPrice = () => {
    const sizePrice = selectedSize.price;
    const milkPrice = selectedMilk?.price || 0;
    const texturePrice = selectedMilkTexture?.price || 0;
    const toppingsPrice = selectedToppings.reduce((sum, t) => sum + t.price, 0);
    return (
      activeProduct.basePrice +
      sizePrice +
      milkPrice +
      texturePrice +
      toppingsPrice
    );
  };

  const handleValidation = () => {
    const productData = {
      product: activeProduct,
      selectedSize,
      selectedMilk,
      selectedMilkTexture,
      selectedToppings,
    };

    if (isEditing) {
      updateCartItem(editingCartIndex, {
        ...productData,
        quantity: existingItem!.quantity,
      });
    } else {
      addToCart({ ...productData, quantity: 1 });
    }
  };

  const renderActionBlock = () => (
    <div className="space-y-4 pt-4 border-t border-brand-dark/10 shrink-0">
      <div className="flex justify-between items-end">
        <span className="font-londrina text-lg text-brand-dark/40 uppercase">
          Total recette
        </span>
        <span className="font-londrina text-4xl text-brand-dark tracking-wide">
          {calculateCurrentPrice().toFixed(2)}€
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setScreen(isEditing ? "cart" : "menu")}
          className="py-3.5 border-2 border-brand-dark/10 text-brand-dark font-londrina text-xl rounded-2xl cursor-pointer bg-white"
        >
          Retour
        </button>
        <button
          onClick={handleValidation}
          className="py-3.5 bg-brand-dark hover:bg-brand-dark/95 text-white font-londrina text-xl rounded-2xl shadow-lg cursor-pointer"
        >
          {isEditing ? "Mettre à jour" : "Valider"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-dark text-white p-4 sm:p-8 flex flex-col items-center justify-center select-none overflow-y-auto">
      <div
        className={`w-full bg-white text-brand-dark rounded-[3rem] p-6 sm:p-10 shadow-2xl flex flex-col transition-all duration-300 ${
          hasToppings
            ? "max-w-5xl lg:flex-row gap-10 items-stretch"
            : "max-w-2xl flex-col gap-6"
        }`}
      >
        <div className="flex-1 flex flex-col justify-between gap-6">
          <div className="space-y-1">
            <span className="font-londrina text-amber-700 text-lg tracking-wider uppercase block">
              {isEditing ? "*Je change mon mien !" : "*C'est mon mien !"}
            </span>
            <h2 className="font-meringue text-3xl sm:text-5xl text-brand-dark leading-tight">
              {activeProduct.name}
            </h2>
            <p className="text-xs sm:text-sm text-brand-dark/60 font-light leading-relaxed pt-1">
              {activeProduct.description}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-londrina text-xl text-brand-dark border-b border-brand-dark/10 pb-1">
              Choisir la taille
            </h4>
            <div className="flex flex-wrap gap-2">
              {activeProduct.customization.sizes.map((size) => (
                <button
                  key={size.name}
                  onClick={() => setSelectedSize(size)}
                  className={`px-5 py-2.5 rounded-xl font-londrina text-lg cursor-pointer transition-all ${
                    selectedSize.name === size.name
                      ? "bg-brand-dark text-white shadow-md"
                      : "bg-brand-dark/5 hover:bg-brand-dark/10 text-brand-dark"
                  }`}
                >
                  {size.name} {size.price > 0 && `(+${size.price.toFixed(2)}€)`}
                </button>
              ))}
            </div>
          </div>

          {activeProduct.customization.requiresMilk && (
            <div className="space-y-2">
              <h4 className="font-londrina text-xl text-brand-dark border-b border-brand-dark/10 pb-1">
                Type de lait
              </h4>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_MILKS.map((milk) => (
                  <button
                    key={milk.name}
                    onClick={() => setSelectedMilk(milk)}
                    className={`px-5 py-2.5 rounded-xl font-londrina text-lg cursor-pointer transition-all ${
                      selectedMilk?.name === milk.name
                        ? "bg-brand-dark text-white shadow-md"
                        : "bg-brand-dark/5 hover:bg-brand-dark/10 text-brand-dark"
                    }`}
                  >
                    {milk.name}{" "}
                    {milk.price > 0 && `(+${milk.price.toFixed(2)}€)`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeProduct.customization.allowsMilkTexture && (
            <div className="space-y-2">
              <h4 className="font-londrina text-xl text-brand-dark border-b border-brand-dark/10 pb-1">
                Texture de la mousse
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {AVAILABLE_MILK_TEXTURES.map((texture) => (
                  <button
                    key={texture.name}
                    onClick={() => setSelectedMilkTexture(texture)}
                    className={`px-4 py-2.5 rounded-xl font-londrina text-base text-center cursor-pointer transition-all ${
                      selectedMilkTexture?.name === texture.name
                        ? "bg-brand-dark text-white shadow-md"
                        : "bg-brand-dark/5 hover:bg-brand-dark/10 text-brand-dark"
                    }`}
                  >
                    {texture.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!hasToppings && renderActionBlock()}
        </div>

        {hasToppings && (
          <div className="flex-1 flex flex-col justify-between gap-6 border-t lg:border-t-0 lg:border-l border-brand-dark/10 pt-6 lg:pt-0 lg:pl-8">
            <div className="space-y-2 flex-1">
              <h4 className="font-londrina text-xl text-brand-dark border-b border-brand-dark/10 pb-1">
                Toppings (Cumulables au choix)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {AVAILABLE_TOPPINGS.map((topping) => {
                  const isChecked = selectedToppings.some(
                    (t) => t.name === topping.name,
                  );
                  return (
                    <button
                      key={topping.name}
                      onClick={() => toggleTopping(topping)}
                      className={`flex flex-col justify-center items-center p-3 rounded-2xl font-londrina text-center border-2 transition-all cursor-pointer aspect-[4/3] sm:aspect-auto md:h-20 ${
                        isChecked
                          ? "bg-amber-50 border-amber-600 text-brand-dark shadow-sm"
                          : "bg-brand-dark/[0.03] border-transparent text-brand-dark/80 hover:bg-brand-dark/5"
                      }`}
                    >
                      <span className="text-base block leading-tight">
                        {isChecked ? "✅ " : "➕ "} {topping.name}
                      </span>
                      <span className="font-sans font-extrabold text-xs text-amber-800 mt-1">
                        +{topping.price.toFixed(2)}€
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            {renderActionBlock()}
          </div>
        )}
      </div>
    </div>
  );
};
