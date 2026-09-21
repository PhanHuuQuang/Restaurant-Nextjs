"use client";

import { useEffect, useState } from "react";
import { getMyOrders, type Order } from "@/api/orders";

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <div className="p-4 lg:px-20 xl:px-40 text-red-500">
        Unable to load your orders. Please try again later.
      </div>
    );
  }

  if (!orders) {
    return (
      <div className="p-4 lg:px-20 xl:px-40 text-red-500">Loading...</div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-4 lg:px-20 xl:px-40 text-xl font-bold text-red-500">
        You have no orders yet.
      </div>
    );
  }

  return (
    <div className="p-4 lg:px-20 xl:px-40">
      <table className="w-full border-separate border-spacing-1">
        <thead>
          <tr className="text-left text-red-500">
            <th className="hidden md:block">Order ID</th>
            <th>Date</th>
            <th>Price</th>
            <th className="hidden md:block">Products</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr
              key={order.id}
              className={`text-sm md:text-base ${
                index % 2 === 0 ? "bg-red-100" : "bg-gray-100"
              }`}
            >
              <td className="hidden md:block py-6 px-1">{order.id}</td>
              <td className="py-6 px-1">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="py-6 px-1">{order.total}</td>
              <td className="hidden md:block py-6 px-1">
                {order.items
                  .map(
                    (item) =>
                      `${item.product.title}${item.sizeOption ? ` (${item.sizeOption})` : ""} x${item.quantity}`,
                  )
                  .join(", ")}
              </td>
              <td className="py-6 px-1">{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersPage;