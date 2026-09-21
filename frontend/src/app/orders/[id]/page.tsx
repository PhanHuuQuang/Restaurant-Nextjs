"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getOrder, type Order } from "@/api/orders";

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    getOrder(Number(id))
      .then(setOrder)
      .catch(() => setError(true));
  }, [id]);

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-red-500">
        <p className="text-xl font-bold">Unable to load this order.</p>
        <Link href="/orders" className="bg-red-500 text-white p-3 rounded-md">
          View my orders
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-red-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-4 lg:px-20 xl:px-40 lg:py-10 text-red-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Order #{order.id}</h1>
          <p className="text-sm text-gray-500">
            Placed on {new Date(order.createdAt).toLocaleDateString()} at{" "}
            {new Date(order.createdAt).toLocaleTimeString()}
          </p>
        </div>
        <span className="bg-red-100 px-4 py-2 rounded-md font-bold uppercase">
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ITEMS */}
        <div className="bg-fuchsia-50 rounded-md p-4 col-span-1">
          <h2 className="text-lg font-bold mb-4">Items</h2>
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between mb-4"
            >
              {item.product.img && (
                <Image
                  className="w-16 h-16"
                  src={item.product.img}
                  alt={item.product.title}
                  width={80}
                  height={80}
                />
              )}
              <div>
                <h3 className="uppercase font-bold">{item.product.title}</h3>
                {item.sizeOption && <span>{item.sizeOption}</span>}
                <div className="text-sm">Quantity: {item.quantity}</div>
              </div>
              <span className="font-bold">
                ${(Number(item.price) * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* PAYMENT INFO */}
        <div className="flex flex-col gap-4">
          <div className="bg-fuchsia-50 rounded-md p-4">
            <h2 className="text-lg font-bold mb-2">Delivery</h2>
            <p className="text-sm">Address: {order.address}</p>
            <p className="text-sm">Phone: {order.phone}</p>
            <p className="text-sm mt-2">
              Payment method: <span className="font-bold">{order.paymentMethod}</span>
            </p>
          </div>
          <div className="bg-fuchsia-50 rounded-md p-4">
            <h2 className="text-lg font-bold mb-2">Summary</h2>
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>${Number(order.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Service Cost</span>
              <span>${Number(order.serviceCost).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Delivery Cost</span>
              <span className="text-green-500">FREE!</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-bold">
              <span>TOTAL</span>
              <span>${Number(order.total).toFixed(2)}</span>
            </div>
          </div>
          <Link
            href="/orders"
            className="bg-red-500 text-white p-3 rounded-md text-center"
          >
            View all orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;