import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CartPage from '../page';

vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    return <img src={props.src as string} alt={props.alt as string} />;
  },
}));

describe('CartPage', () => {
  it('should render cart items', () => {
    render(<CartPage />);
    const items = screen.getAllByText('sicilian');
    expect(items.length).toBeGreaterThan(0);
  });

  it('should render item prices', () => {
    render(<CartPage />);
    const prices = screen.getAllByText('$12.3');
    expect(prices.length).toBe(3);
  });

  it('should render item size', () => {
    render(<CartPage />);
    const sizes = screen.getAllByText('Large');
    expect(sizes.length).toBe(3);
  });

  it('should render remove buttons', () => {
    render(<CartPage />);
    const removeButtons = screen.getAllByText('X');
    expect(removeButtons.length).toBe(3);
  });

  it('should render subtotal', () => {
    render(<CartPage />);
    expect(screen.getByText('Subtotal (3 items)')).toBeDefined();
    const amounts = screen.getAllByText('$23.4');
    expect(amounts.length).toBeGreaterThanOrEqual(1);
  });

  it('should render service cost', () => {
    render(<CartPage />);
    expect(screen.getByText('Service Cost')).toBeDefined();
    expect(screen.getByText('$0.00')).toBeDefined();
  });

  it('should render free delivery', () => {
    render(<CartPage />);
    expect(screen.getByText('Delivery Cost')).toBeDefined();
    expect(screen.getByText('FREE!')).toBeDefined();
  });

  it('should render total', () => {
    render(<CartPage />);
    expect(screen.getByText('TOTAL(INCL. VAT)')).toBeDefined();
  });

  it('should render checkout button', () => {
    render(<CartPage />);
    expect(screen.getByText('CHECKOUT')).toBeDefined();
  });
});
