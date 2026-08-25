import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import OrdersPage from '../page';

describe('OrdersPage', () => {
  it('should render table headers', () => {
    render(<OrdersPage />);
    expect(screen.getByText('Date')).toBeDefined();
    expect(screen.getByText('Price')).toBeDefined();
    expect(screen.getByText('Status')).toBeDefined();
  });

  it('should render hidden Order ID header on mobile', () => {
    render(<OrdersPage />);
    const th = screen.getByText('Order ID');
    expect(th.className).toContain('hidden');
  });

  it('should render hidden Products header on mobile', () => {
    render(<OrdersPage />);
    const th = screen.getByText('Products');
    expect(th.className).toContain('hidden');
  });

  it('should render order rows', () => {
    render(<OrdersPage />);
    const dates = screen.getAllByText('03.08.2023');
    expect(dates.length).toBe(3);
  });

  it('should render order prices', () => {
    render(<OrdersPage />);
    const prices = screen.getAllByText('12.34');
    expect(prices.length).toBe(3);
  });

  it('should render order products', () => {
    render(<OrdersPage />);
    const products = screen.getAllByText(/Big Burger Menu \(2\), Veggie Pizza \(2\)/);
    expect(products.length).toBe(3);
  });

  it('should render order status', () => {
    render(<OrdersPage />);
    const statuses = screen.getAllByText(/On the way \(approx\. 10min\)/);
    expect(statuses.length).toBe(3);
  });

  it('should render order IDs', () => {
    render(<OrdersPage />);
    const ids = screen.getAllByText('13133123313');
    expect(ids.length).toBe(3);
  });
});
