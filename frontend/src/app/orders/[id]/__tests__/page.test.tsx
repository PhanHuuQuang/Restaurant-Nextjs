import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import OrderDetailPage from '../page';
import { getOrder } from '../../../../api/orders';

const { params } = vi.hoisted(() => ({ params: { id: '1' } }));

vi.mock('next/navigation', () => ({
  useParams: () => params,
}));

vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    return <img src={props.src as string} alt={props.alt as string} />;
  },
}));

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  },
}));

vi.mock('../../../../api/orders', () => ({
  getOrder: vi.fn(),
}));

const mockOrder = {
  id: 1,
  userId: 1,
  subtotal: 16.3,
  serviceCost: 0.82,
  deliveryCost: 0,
  total: 17.12,
  status: 'PENDING',
  paymentMethod: 'CASH',
  address: '456 Oak St',
  phone: '0123456789',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  items: [
    {
      id: 1,
      orderId: 1,
      productId: 5,
      quantity: 2,
      sizeOption: 'Large',
      price: 8.15,
      product: { id: 5, title: 'Sicilian', img: '/temporary/p1.png' },
    },
  ],
};

describe('OrderDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render order details with product names', async () => {
    vi.mocked(getOrder).mockResolvedValue(mockOrder as never);
    render(<OrderDetailPage />);
    expect(await screen.findByText('Order #1')).toBeDefined();
    expect(screen.getByText('Sicilian')).toBeDefined();
    expect(screen.getByText('CASH')).toBeDefined();
    expect(
      screen.getByText((content) => content.includes('456 Oak St')),
    ).toBeDefined();
    expect(screen.getByText('$17.12')).toBeDefined();
  });

  it('should call getOrder with the param id', async () => {
    vi.mocked(getOrder).mockResolvedValue(mockOrder as never);
    render(<OrderDetailPage />);
    await screen.findByText('Order #1');
    expect(getOrder).toHaveBeenCalledWith(1);
  });

  it('should render error state when order cannot be loaded', async () => {
    vi.mocked(getOrder).mockRejectedValue(new Error('fail'));
    render(<OrderDetailPage />);
    expect(
      await screen.findByText('Unable to load this order.'),
    ).toBeDefined();
  });
});