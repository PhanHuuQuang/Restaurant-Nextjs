"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart, itemKey } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { createOrder, type PaymentMethod } from "@/api/orders";

const PAYMENT_OPTIONS: { value: PaymentMethod; label: string }[] = [
  { value: "CASH", label: "Cash on Delivery" },
  { value: "CARD", label: "Credit / Debit Card" },
  { value: "WALLET", label: "E-Wallet" },
];

const inputClass =
  "p-3 ring-1 ring-red-400 rounded-md text-red-500 bg-white outline-none focus:ring-2";

const CheckoutPage = () => {
  const {
    items,
    subtotal,
    serviceCost,
    deliveryCost,
    total,
    clear,
  } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [address, setAddress] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [error, setError] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);

  const effectiveAddress = address ?? user?.address ?? "";
  const effectivePhone = phone ?? user?.phone ?? "";

  if (items.length === 0) {
    return (
      <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex flex-col items-center justify-center gap-4 text-red-500">
        <div className="text-xl font-bold">Your cart is empty.</div>
        <button
          onClick={() => router.push("/menu")}
          className="bg-red-500 text-white p-3 rounded-md"
        >
          Browse Menu
        </button>
      </div>
    );
  }

  const handleContinue = () => {
    if (!effectiveAddress.trim() || !effectivePhone.trim()) {
      setError("Please provide both delivery address and phone number.");
      return;
    }
    if (!user) {
      setError("Please log in before placing an order.");
      return;
    }
    setError(null);
    setStep(1);
  };

  const handlePlaceOrder = async () => {
    setError(null);
    setPlacing(true);
    try {
      const order = await createOrder({
        address: effectiveAddress.trim(),
        phone: effectivePhone.trim(),
        paymentMethod,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          sizeOption: i.sizeOption ?? undefined,
        })),
      });
      clear();
      router.push(`/orders/${order.id}`);
    } catch {
      setError("Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex flex-col text-red-500 lg:flex-row">
      {/* ORDER SUMMARY */}
      <div className="h-1/2 p-4 flex flex-col justify-center overflow-y-scroll lg:h-full lg:w-2/3 2xl:w-1/2 lg:px-10 xl:px-30">
        <h1 className="text-2xl font-bold mb-4">Order Summary</h1>
        {items.map((item) => {
          const key = itemKey(item);
          const linePrice = (item.price + item.additionalPrice) * item.quantity;
          return (
            <div key={key} className="flex items-center justify-between mb-4">
              {item.img && (
                <Image
                  className="w-16 h-16 lg:w-20 lg:h-20"
                  src={item.img}
                  alt={item.title}
                  width={80}
                  height={80}
                />
              )}
              <div>
                <h2 className="uppercase text-lg font-bold">{item.title}</h2>
                {item.sizeOption && <span>{item.sizeOption}</span>}
                <div className="text-sm">Quantity: {item.quantity}</div>
              </div>
              <h3 className="font-bold">${linePrice.toFixed(2)}</h3>
            </div>
          );
        })}
        <div className="border-t border-red-300 pt-4 flex flex-col gap-2">
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
          <div className="flex justify-between font-bold">
            <span>TOTAL(INCL. VAT)</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* CHECKOUT FLOW */}
      <div className="h-1/2 p-4 bg-fuchsia-50 flex flex-col gap-4 justify-center lg:h-full lg:w-1/3 2xl:w-1/2 lg:px-10 xl:px-20 xl:text-xl xl:gap-6">
        {step === 0 && (
          <>
            <div>
              <h2 className="text-xl font-bold">Delivery Information</h2>
              <p className="text-sm text-gray-500">
                {user
                  ? "We have prefilled your details when available."
                  : "Sign in to prefill your details."}
              </p>
            </div>
            <input
              type="text"
              placeholder="Delivery address"
              value={effectiveAddress}
              onChange={(e) => setAddress(e.target.value)}
              className={inputClass}
            />
            <input
              type="text"
              placeholder="Phone number"
              value={effectivePhone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
            />
            {error && <p className="text-sm text-red-700">{error}</p>}
            <button
              onClick={handleContinue}
              className="bg-red-500 text-white p-3 rounded-md w-1/2 self-end"
            >
              Continue
            </button>
          </>
        )}

        {step === 1 && (
          <>
            <div>
              <h2 className="text-xl font-bold">Payment Method</h2>
              <p className="text-sm text-gray-500">
                How would you like to pay?
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {PAYMENT_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-3 p-3 rounded-md ring-1 cursor-pointer bg-white text-red-500 ${
                    paymentMethod === option.value
                      ? "ring-red-500"
                      : "ring-red-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={option.value}
                    checked={paymentMethod === option.value}
                    onChange={() => setPaymentMethod(option.value)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
            {error && <p className="text-sm text-red-700">{error}</p>}
            <div className="flex gap-3 self-end">
              <button
                onClick={() => setStep(0)}
                className="p-3 rounded-md ring-1 ring-red-400"
              >
                Back
              </button>
              <button
                onClick={handlePlaceOrder}
                disabled={placing}
                className="bg-red-500 text-white p-3 rounded-md disabled:opacity-50"
              >
                {placing ? "PLACING ORDER..." : "PLACE ORDER"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;