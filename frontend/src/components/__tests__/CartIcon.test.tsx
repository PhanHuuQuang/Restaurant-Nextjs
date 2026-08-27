import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CartIcon from '../CartIcon';

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

describe('CartIcon', () => {
  it('should render cart text with count', () => {
    render(<CartIcon />);
    expect(screen.getByText('Cart(3)')).toBeDefined();
  });

  it('should link to cart page', () => {
    render(<CartIcon />);
    const link = screen.getByText('Cart(3)').closest('a');
    expect(link?.getAttribute('href')).toBe('/cart');
  });

  it('should call onClick when provided', () => {
    const onClick = vi.fn();
    render(<CartIcon onClick={onClick} />);
    const link = screen.getByText('Cart(3)').closest('a');
    link!.click();
    expect(onClick).toHaveBeenCalled();
  });
});
