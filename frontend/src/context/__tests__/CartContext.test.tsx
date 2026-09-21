import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider, useCart } from '../CartContext';

function Probe() {
  const cart = useCart();
  return (
    <div>
      <span data-testid="count">{cart.items.length}</span>
      <span data-testid="qty">{cart.totalQuantity}</span>
      <span data-testid="subtotal">{cart.subtotal}</span>
      <span data-testid="service">{cart.serviceCost}</span>
      <span data-testid="total">{cart.total}</span>
      <button onClick={() => cart.addItem(cartItem, 1)}>add</button>
      <button onClick={() => cart.addItem(cartItem, 2)}>add2</button>
      <button onClick={() => cart.addItem(cartItemSmall, 1)}>add-small</button>
      <button onClick={() => cart.removeItem('1-Large')}>remove</button>
      <button onClick={() => cart.updateQuantity('1-Large', 5)}>update</button>
      <button onClick={() => cart.clear()}>clear</button>
    </div>
  );
}

const cartItem = {
  productId: 1,
  title: 'Sicilian',
  img: null,
  price: 12.3,
  sizeOption: 'Large',
  additionalPrice: 4,
};

const cartItemSmall = {
  ...cartItem,
  sizeOption: 'Small',
  additionalPrice: 0,
};

function renderProbe() {
  return render(
    <CartProvider>
      <Probe />
    </CartProvider>,
  );
}

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should add a new item', () => {
    renderProbe();
    fireEvent.click(screen.getByText('add'));
    expect(screen.getByTestId('count').textContent).toBe('1');
    expect(screen.getByTestId('qty').textContent).toBe('1');
  });

  it('should merge items with the same size option', () => {
    renderProbe();
    fireEvent.click(screen.getByText('add'));
    fireEvent.click(screen.getByText('add2'));
    expect(screen.getByTestId('count').textContent).toBe('1');
    expect(screen.getByTestId('qty').textContent).toBe('3');
  });

  it('should keep different size options separate', () => {
    renderProbe();
    fireEvent.click(screen.getByText('add'));
    fireEvent.click(screen.getByText('add-small'));
    expect(screen.getByTestId('count').textContent).toBe('2');
  });

  it('should remove an item', () => {
    renderProbe();
    fireEvent.click(screen.getByText('add'));
    fireEvent.click(screen.getByText('remove'));
    expect(screen.getByTestId('count').textContent).toBe('0');
  });

  it('should update quantity', () => {
    renderProbe();
    fireEvent.click(screen.getByText('add'));
    fireEvent.click(screen.getByText('update'));
    expect(screen.getByTestId('qty').textContent).toBe('5');
  });

  it('should clear items', () => {
    renderProbe();
    fireEvent.click(screen.getByText('add'));
    fireEvent.click(screen.getByText('clear'));
    expect(screen.getByTestId('count').textContent).toBe('0');
  });

  it('should compute subtotal, service cost and total', () => {
    renderProbe();
    fireEvent.click(screen.getByText('add'));
    expect(screen.getByTestId('subtotal').textContent).toBe(String(16.3));
    expect(screen.getByTestId('service').textContent).toBe(String(0.82));
    expect(screen.getByTestId('total').textContent).toBe(String(17.12));
  });

  it('should persist items to localStorage', () => {
    renderProbe();
    fireEvent.click(screen.getByText('add'));
    const stored = JSON.parse(localStorage.getItem('cart') ?? '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].productId).toBe(1);
  });

  it('should restore items from localStorage', () => {
    localStorage.setItem('cart', JSON.stringify([cartItem]));
    renderProbe();
    expect(screen.getByTestId('count').textContent).toBe('1');
  });
});