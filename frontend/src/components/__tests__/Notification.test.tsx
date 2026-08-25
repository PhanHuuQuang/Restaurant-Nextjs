import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Notification from '../Notification';

describe('Notification', () => {
  it('should render free delivery message', () => {
    render(<Notification />);
    expect(
      screen.getByText(/Free delivery for all orders over \$50/),
    ).toBeDefined();
  });

  it('should have red background styling', () => {
    render(<Notification />);
    const el = screen.getByText(/Free delivery/);
    expect(el.className).toContain('bg-red-500');
  });
});
