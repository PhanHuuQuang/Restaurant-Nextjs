import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CartIcon from '../CartIcon';
import { CartProvider } from '../../context/CartContext';

vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    return <img src={props.src as string} alt={props.alt as string} />;
  },
}));

vi.mock('next/link', () => ({
  default: ({ children, href, onClick }: { children: React.ReactNode; href: string; onClick?: () => void }) => {
    return <a href={href} onClick={onClick}>{children}</a>;
  },
}));

function renderIcon(onClick?: () => void) {
  return render(
    <CartProvider>
      <CartIcon onClick={onClick} />
    </CartProvider>,
  );
}

describe('CartIcon', () => {
  it('should render cart text with count', () => {
    renderIcon();
    expect(screen.getByText('Cart(0)')).toBeDefined();
  });

  it('should link to cart page', () => {
    renderIcon();
    const link = screen.getByText('Cart(0)').closest('a');
    expect(link?.getAttribute('href')).toBe('/cart');
  });

  it('should call onClick when provided', () => {
    const onClick = vi.fn();
    renderIcon(onClick);
    const link = screen.getByText('Cart(0)').closest('a');
    link!.click();
    expect(onClick).toHaveBeenCalled();
  });
});