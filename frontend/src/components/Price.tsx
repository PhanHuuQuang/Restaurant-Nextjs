"use client";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

type Props = {
  id: number;
  price: number;
  title?: string;
  img?: string | null;
  options?: {
    title: string;
    additionalPrice: number;
  }[];
};

const Price = ({ price, id, title, img, options }: Props) => {
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState(0);
  const { addItem } = useCart();

  const total =
    quantity * (options ? price + options[selected].additionalPrice : price);

  const handleAddToCart = () => {
    addItem(
      {
        productId: id,
        title: title ?? "Product",
        img: img ?? null,
        price,
        sizeOption: options?.[selected].title ?? undefined,
        additionalPrice: options?.[selected].additionalPrice ?? 0,
      },
      quantity,
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">${total.toFixed(2)}</h2>
      {/* OPTIONS CONTAINER */}
      <div className="flex gap-4">
        {options?.map((option, index) => (
          <button
            key={option.title}
            className="min-w-[6rem] p-2 ring-1 ring-red-400 rounded-md"
            style={{
              background: selected === index ? "rgb(248 113 113)" : "white",
              color: selected === index ? "white" : "red",
            }}
            onClick={() => setSelected(index)}
          >
            {option.title}
          </button>
        ))}
      </div>
      {/* QUANTITY AND ADD BUTTON CONTAINER */}
      <div className="flex justify-between items-center">
        {/* QUANTITY */}
        <div className="flex justify-between w-full p-3 ring-1 ring-red-500">
          <span>Quantity</span>
          <div className="flex gap-4 items-center">
            <button
              //   onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
              onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 9))}
            >
              {"<"}
            </button>
            <span>{quantity}</span>
            <button
              //   onClick={() => setQuantity(quantity < 9 ? quantity + 1 : 1)}
              onClick={() => setQuantity((prev) => (prev < 9 ? prev + 1 : 1))}
            >
              {">"}
            </button>
          </div>
        </div>
        {/* CART BUTTON */}
        <button
          onClick={handleAddToCart}
          className="uppercase w-56 text-white bg-red-500 p-3 ring-1 ring-red-500"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Price;
