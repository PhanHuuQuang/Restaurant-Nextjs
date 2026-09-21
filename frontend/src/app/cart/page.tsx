"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart, itemKey } from "@/context/CartContext";

const CartPage = () => {
  const { items, subtotal, serviceCost, deliveryCost, total, updateQuantity, removeItem } =
    useCart();
  const router = useRouter();

  return (
    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex flex-col text-red-500 lg:flex-row">
      {/* PRODUCT CONTAINER */}
      <div className="h-1/2 p-4 flex flex-col justify-center overflow-y-scroll lg:h-full lg:w-2/3 2xl:w-1/2 lg:px-10 xl:px-30">
        {items.length === 0 ? (
          <div className="text-center text-xl font-bold">
            Your cart is empty.
          </div>
        ) : (
          items.map((item) => {
            const key = itemKey(item);
            const linePrice = (item.price + item.additionalPrice) * item.quantity;
            return (
              <div
                key={key}
                className="flex items-center justify-between mb-4"
              >
                {item.img && (
                  <Image
                    className="w-20 h-20 lg:w-[120px] lg:h-[120px]"
                    src={item.img}
                    alt={item.title}
                    width={100}
                    height={100}
                  />
                )}
                <div className="flex flex-col gap-1">
                  <h1 className="uppercase text-xl font-bold">{item.title}</h1>
                  {item.sizeOption && <span>{item.sizeOption}</span>}
                  <div className="flex items-center gap-3">
                    <span className="text-sm">Quantity:</span>
                    <div className="flex items-center gap-2">
                      <button
                        className="ring-1 ring-red-500 px-2"
                        onClick={() =>
                          updateQuantity(key, item.quantity - 1)
                        }
                      >
                        {"<"}
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        className="ring-1 ring-red-500 px-2"
                        onClick={() =>
                          updateQuantity(key, item.quantity + 1)
                        }
                      >
                        {">"}
                      </button>
                    </div>
                  </div>
                </div>
                <h2 className="font-bold">${linePrice.toFixed(2)}</h2>
                <button
                  onClick={() => removeItem(key)}
                  className="cursor-pointer"
                  aria-label={`Remove ${item.title}`}
                >
                  X
                </button>
              </div>
            );
          })
        )}
      </div>
      {/* PAYMENT CONTAINER */}
      <div className="h-1/2 p-4 bg-fuchsia-50 flex flex-col gap-4 justify-center lg:h-full lg:w-1/3 2xl:w-1/2 lg:px-10 xl:px-20 xl:text-xl xl:gap-6">
        <div className="flex justify-between">
          <span>Subtotal ({items.length} items)</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Service Cost</span>
          <span>${serviceCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery Cost</span>
          <span className="text-green-500">FREE!</span>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between">
          <span>TOTAL(INCL. VAT)</span>
          <span className="font-bold">${total.toFixed(2)}</span>
        </div>
        <button
          onClick={() => router.push("/checkout")}
          disabled={items.length === 0}
          className="bg-red-500 text-white p-3 rounded-md w-1/2 self-end disabled:opacity-50"
        >
          CHECKOUT
        </button>
      </div>
    </div>
  );
};

export default CartPage;