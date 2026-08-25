import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Menu from '../Menu';

vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    return (
      <img
        src={props.src as string}
        alt={props.alt as string}
        onClick={props.onClick as () => void}
        data-testid={`img-${props.alt}`}
      />
    );
  },
}));

vi.mock('next/link', () => ({
  default: ({ children, href, onClick }: { children: React.ReactNode; href: string; onClick?: () => void }) => {
    return (
      <a href={href} onClick={onClick}>
        {children}
      </a>
    );
  },
}));

vi.mock('../CartIcon', () => ({
  default: ({ onClick }: { onClick?: () => void }) => (
    <div data-testid="cart-icon" onClick={onClick}>
      Cart
    </div>
  ),
}));

describe('Menu', () => {
  it('should render the open menu button initially', () => {
    render(<Menu />);
    expect(screen.getByTestId('img-Open Menu')).toBeDefined();
  });

  it('should open menu when open button is clicked', () => {
    render(<Menu />);
    fireEvent.click(screen.getByTestId('img-Open Menu'));
    expect(screen.getByText('Homepage')).toBeDefined();
    expect(screen.getByText('Working Hours')).toBeDefined();
    expect(screen.getByText('Contacts')).toBeDefined();
    expect(screen.getByText('Login')).toBeDefined();
  });

  it('should close menu when close button is clicked', () => {
    render(<Menu />);
    fireEvent.click(screen.getByTestId('img-Open Menu'));
    fireEvent.click(screen.getByTestId('img-Close Menu'));
    expect(screen.queryByText('Homepage')).toBeNull();
  });

  it('should render links with correct hrefs when open', () => {
    render(<Menu />);
    fireEvent.click(screen.getByTestId('img-Open Menu'));

    const homepage = screen.getByText('Homepage');
    expect(homepage.getAttribute('href')).toBe('/');

    const menu = screen.getByText('Menu');
    expect(menu.getAttribute('href')).toBe('/menu');
  });

  it('should show Login link when user is not logged in', () => {
    render(<Menu />);
    fireEvent.click(screen.getByTestId('img-Open Menu'));
    expect(screen.getByText('Login')).toBeDefined();
  });

  it('should close menu when a link is clicked', () => {
    render(<Menu />);
    fireEvent.click(screen.getByTestId('img-Open Menu'));
    fireEvent.click(screen.getByText('Homepage'));
    expect(screen.queryByText('Working Hours')).toBeNull();
  });
});
