import { describe, it, expect, vi, beforeEach } from "vitest";
import { createOrder, getMyOrders, getOrder } from "../orders";
import { ApiError } from "../client";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

beforeEach(() => {
  vi.clearAllMocks();
});

function jsonResponse(data: unknown, status = 200) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? "OK" : "Error",
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  });
}

const mockOrder = {
  id: 1,
  userId: 1,
  subtotal: 16.3,
  serviceCost: 0.82,
  deliveryCost: 0,
  total: 17.12,
  status: "PENDING",
  paymentMethod: "CASH",
  address: "123 Main St",
  phone: "555-1234",
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01",
  items: [
    {
      id: 1,
      orderId: 1,
      productId: 1,
      quantity: 2,
      sizeOption: "Large",
      price: 8.15,
      product: { id: 1, title: "Sicilian", img: "/temporary/p1.png" },
    },
  ],
};

describe("orders API client", () => {
  describe("createOrder", () => {
    it("should send POST request with order payload", async () => {
      mockFetch.mockReturnValue(jsonResponse(mockOrder));

      const result = await createOrder({
        address: "123 Main St",
        phone: "555-1234",
        paymentMethod: "CASH",
        items: [{ productId: 1, quantity: 2, sizeOption: "Large" }],
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/orders"),
        expect.objectContaining({
          method: "POST",
          cache: "no-store",
          credentials: "include",
          body: JSON.stringify({
            address: "123 Main St",
            phone: "555-1234",
            paymentMethod: "CASH",
            items: [{ productId: 1, quantity: 2, sizeOption: "Large" }],
          }),
        }),
      );
      expect(result).toEqual(mockOrder);
    });

    it("should throw ApiError on failure", async () => {
      mockFetch.mockReturnValue(jsonResponse("Unauthorized", 401));

      await expect(
        createOrder({ address: "a", phone: "p", items: [] }),
      ).rejects.toThrow(ApiError);
    });
  });

  describe("getMyOrders", () => {
    it("should GET /orders/my", async () => {
      mockFetch.mockReturnValue(jsonResponse([mockOrder]));

      const result = await getMyOrders();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/orders/my"),
        expect.objectContaining({ cache: "no-store", credentials: "include" }),
      );
      expect(result).toEqual([mockOrder]);
    });

    it("should throw ApiError on failure", async () => {
      mockFetch.mockReturnValue(jsonResponse("Unauthorized", 401));

      await expect(getMyOrders()).rejects.toThrow(ApiError);
    });
  });

  describe("getOrder", () => {
    it("should GET a single order by id", async () => {
      mockFetch.mockReturnValue(jsonResponse(mockOrder));

      const result = await getOrder(1);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/orders/1"),
        expect.objectContaining({ cache: "no-store", credentials: "include" }),
      );
      expect(result).toEqual(mockOrder);
    });

    it("should throw ApiError on failure", async () => {
      mockFetch.mockReturnValue(jsonResponse("Not Found", 404));

      await expect(getOrder(999)).rejects.toThrow(ApiError);
    });
  });
});