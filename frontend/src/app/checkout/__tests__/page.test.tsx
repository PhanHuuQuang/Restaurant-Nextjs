import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CheckoutPage from '../page';
import { CartProvider } from '../../../context/CartContext';
import { AuthContext } from '../../../context/AuthContext';
import { createOrder } from '../../../api/orders';

const { push } = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    return <img src={props.src as string} alt={props.alt as string} />;
  },
}));

vi.mock('../../../api/orders', () => ({
  createOrder: vi.fn(),
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
];

const user = {
  id: 1,
  name: 'Quang',
  email: 'quang@test.com',
  phone: '0123456789',
  address: '456 Oak St',
  role: 'USER',
};

function seedCart() {
  localStorage.setItem('cart', JSON.stringify(items));
}

function renderPage(authUser = user) {
  return render(
    <AuthContext.Provider
      value={{
        user: authUser,
        loading: false,
        setUser: vi.fn(),
        login: vi.fn(),
        logout: vi.fn(),
      }}
    >
      <CartProvider>
        <CheckoutPage />
      </CartProvider>
    </AuthContext.Provider>,
  );
}

describe('CheckoutPage', () => {
  beforeEach(() => {
    localStorage.clear();
    push.mockClear();
    vi.mocked(createOrder).mockClear();
    vi.mocked(createOrder).mockResolvedValue({
      id: 7,
      address: '456 Oak St',
      phone: '0123456789',
      paymentMethod: 'CASH',
      items: [],
    } as never);
  });

  it('should show empty cart message when there are no items', () => {
    renderPage();
    expect(screen.getByText('Your cart is empty.')).toBeDefined();
  });

  it('should render order summary from cart', () => {
    seedCart();
    renderPage();
    expect(screen.getByText('Order Summary')).toBeDefined();
    expect(screen.getByText('Sicilian')).toBeDefined();
    expect(screen.getAllByText('$32.60').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('$34.23')).toBeDefined();
  });

  it('should prefill address and phone from logged-in user', () => {
    seedCart();
    renderPage();
    expect(
      (screen.getByPlaceholderText('Delivery address') as HTMLInputElement).value,
    ).toBe('456 Oak St');
    expect(
      (screen.getByPlaceholderText('Phone number') as HTMLInputElement).value,
    ).toBe('0123456789');
  });

  it('should require address and phone before continuing', () => {
    seedCart();
    renderPage({ ...user, phone: undefined, address: undefined });
    fireEvent.click(screen.getByText('Continue'));
    expect(
      screen.getByText('Please provide both delivery address and phone number.'),
    ).toBeDefined();
  });

  it('should move to payment step and place order', async () => {
    seedCart();
    renderPage();
    fireEvent.click(screen.getByText('Continue'));

    expect(screen.getByText('Payment Method')).toBeDefined();
    fireEvent.click(screen.getByLabelText('E-Wallet'));
    fireEvent.click(screen.getByText('PLACE ORDER'));

    await waitFor(() =>
      expect(createOrder).toHaveBeenCalledWith({
        address: '456 Oak St',
        phone: '0123456789',
        paymentMethod: 'WALLET',
        items: [{ productId: 1, quantity: 2, sizeOption: 'Large' }],
      }),
    );
    await waitFor(() => expect(push).toHaveBeenCalledWith('/orders/7'));
  });

  it('should show error when order placement fails', async () => {
    seedCart();
    vi.mocked(createOrder).mockRejectedValue(new Error('fail'));
    renderPage();
    fireEvent.click(screen.getByText('Continue'));
    fireEvent.click(screen.getByText('PLACE ORDER'));

    await waitFor(() =>
      expect(screen.getByText('Failed to place order. Please try again.')).toBeDefined(),
    );
  });
});