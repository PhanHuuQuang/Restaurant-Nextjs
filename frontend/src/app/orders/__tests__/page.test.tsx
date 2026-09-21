import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import OrdersPage from '../page';
import { getMyOrders } from '../../../api/orders';

vi.mock('../../../api/orders', () => ({
  getMyOrders: vi.fn(),
}));

const mockOrders = [
  {
    id: 13133123313,
    userId: 1,
    subtotal: 12.34,
    serviceCost: 0.62,
    deliveryCost: 0,
    total: 12.96,
    status: 'PAID',
    paymentMethod: 'CASH',
    address: '123 Main St',
    phone: '555-1234',
    createdAt: '2023-08-03T00:00:00.000Z',
    updatedAt: '2023-08-03T00:00:00.000Z',
    items: [
      {
        id: 1,
        orderId: 13133123313,
        productId: 5,
        quantity: 2,
        sizeOption: 'Large',
        price: 6.17,
        product: { id: 5, title: 'Sicilian', img: null },
      },
    ],
  },
];

describe('OrdersPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render table headers', async () => {
    vi.mocked(getMyOrders).mockResolvedValue(mockOrders as never);
    render(<OrdersPage />);
    expect(await screen.findByText('Date')).toBeDefined();
    expect(screen.getByText('Price')).toBeDefined();
    expect(screen.getByText('Status')).toBeDefined();
  });

  it('should render hidden Order ID header on mobile', async () => {
    vi.mocked(getMyOrders).mockResolvedValue(mockOrders as never);
    render(<OrdersPage />);
    const th = await screen.findByText('Order ID');
    expect(th.className).toContain('hidden');
  });

  it('should render hidden Products header on mobile', async () => {
    vi.mocked(getMyOrders).mockResolvedValue(mockOrders as never);
    render(<OrdersPage />);
    const th = await screen.findByText('Products');
    expect(th.className).toContain('hidden');
  });

  it('should render order rows from API', async () => {
    vi.mocked(getMyOrders).mockResolvedValue(mockOrders as never);
    render(<OrdersPage />);
    expect(await screen.findByText('13133123313')).toBeDefined();
    expect(screen.getByText('PAID')).toBeDefined();
    expect(screen.getByText('12.96')).toBeDefined();
    expect(
      screen.getByText('Sicilian (Large) x2'),
    ).toBeDefined();
  });

  it('should render empty state', async () => {
    vi.mocked(getMyOrders).mockResolvedValue([] as never);
    render(<OrdersPage />);
    expect(await screen.findByText('You have no orders yet.')).toBeDefined();
  });

  it('should render error state', async () => {
    vi.mocked(getMyOrders).mockRejectedValue(new Error('fail'));
    render(<OrdersPage />);
    expect(
      await screen.findByText(
        'Unable to load your orders. Please try again later.',
      ),
    ).toBeDefined();
  });

  it('should call getMyOrders on mount', async () => {
    vi.mocked(getMyOrders).mockResolvedValue([] as never);
    render(<OrdersPage />);
    await screen.findByText('You have no orders yet.');
    expect(getMyOrders).toHaveBeenCalled();
  });
});