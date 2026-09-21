import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CartPage from '../page';
import { CartProvider } from '../../../context/CartContext';

const { push } = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    return <img src={props.src as string} alt={props.alt as string} />;
  },
}));

const items = [
  {
    productId: 1,
    title: 'Sicilian',
    img: '/temporary/p1.png',
    price: 12.3,
    sizeOption: 'Large',
    additionalPrice: 4,
    quantity: 2,
  },
  {
    productId: 2,
    title: 'Margherita',
    img: null,
    price: 10,
    sizeOption: undefined,
    additionalPrice: 0,
    quantity: 1,
  },
];

function seedCart() {
  localStorage.setItem('cart', JSON.stringify(items));
}

function renderPage() {
  return render(
    <CartProvider>
      <CartPage />
    </CartProvider>,
  );
}

describe('CartPage', () => {
  beforeEach(() => {
    localStorage.clear();
    push.mockClear();
  });

  it('should render empty cart message when there are no items', () => {
    renderPage();
    expect(screen.getByText('Your cart is empty.')).toBeDefined();
  });

  it('should render cart items from state', () => {
    seedCart();
    renderPage();
    expect(screen.getByText('Sicilian')).toBeDefined();
    expect(screen.getByText('Large')).toBeDefined();
    expect(screen.getByText('Margherita')).toBeDefined();
  });

  it('should render line prices', () => {
    seedCart();
    renderPage();
    expect(screen.getByText('$32.60')).toBeDefined();
    expect(screen.getByText('$10.00')).toBeDefined();
  });

  it('should compute subtotal', () => {
    seedCart();
    renderPage();
    expect(screen.getByText('Subtotal (2 items)')).toBeDefined();
    expect(screen.getByText('$42.60')).toBeDefined();
  });

  it('should compute service cost', () => {
    seedCart();
    renderPage();
    expect(screen.getByText('Service Cost')).toBeDefined();
    expect(screen.getByText('$2.13')).toBeDefined();
  });

  it('should render free delivery', () => {
    seedCart();
    renderPage();
    expect(screen.getByText('Delivery Cost')).toBeDefined();
    expect(screen.getByText('FREE!')).toBeDefined();
  });

  it('should compute total', () => {
    seedCart();
    renderPage();
    expect(screen.getByText('TOTAL(INCL. VAT)')).toBeDefined();
    expect(screen.getByText('$44.73')).toBeDefined();
  });

  it('should update subtotal when quantity increases', () => {
    seedCart();
    renderPage();
    const buttons = screen.getAllByText('>');
    fireEvent.click(buttons[0]);
    expect(screen.getByText('$58.90')).toBeDefined();
  });

  it('should remove an item when X is clicked', () => {
    seedCart();
    renderPage();
    fireEvent.click(screen.getAllByText('X')[0]);
    expect(screen.queryByText('Sicilian')).toBeNull();
    expect(screen.getByText('Subtotal (1 items)')).toBeDefined();
  });

  it('should route to checkout page when CHECKOUT is clicked', () => {
    seedCart();
    renderPage();
    fireEvent.click(screen.getByText('CHECKOUT'));
    expect(push).toHaveBeenCalledWith('/checkout');
  });

  it('should disable CHECKOUT when cart is empty', () => {
    renderPage();
    expect(
      (screen.getByText('CHECKOUT') as HTMLButtonElement).disabled,
    ).toBe(true);
  });
});