import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import NavBar from '../NavBar';
import { AuthContext } from '@/context/AuthContext';

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

vi.mock('../Menu', () => ({
  default: () => <div data-testid="mobile-menu">Menu</div>,
}));

vi.mock('../CartIcon', () => ({
  default: ({ onClick }: { onClick?: () => void }) => (
    <div data-testid="cart-icon" onClick={onClick}>
      Cart(3)
    </div>
  ),
}));

const renderWithAuth = (user: null | { id: number; name: string; email: string; role: string } = null) => {
  return render(
    <AuthContext.Provider
      value={{
        user,
        token: user ? 'mock-token' : null,
        loading: false,
        setUser: vi.fn(),
        login: vi.fn(),
        logout: vi.fn(),
      }}
    >
      <NavBar />
    </AuthContext.Provider>
  );
};

describe('NavBar', () => {
  it('should render the restaurant name', () => {
    renderWithAuth();
    expect(screen.getByText('MyRestaurant')).toBeDefined();
  });

  it('should render homepage link', () => {
    renderWithAuth();
    const links = screen.getAllByText('Homepage');
    expect(links.length).toBeGreaterThan(0);
    expect(links[0].getAttribute('href')).toBe('/');
  });

  it('should render menu link', () => {
    renderWithAuth();
    const links = screen.getAllByText('Menu');
    expect(links.length).toBeGreaterThan(0);
  });

  it('should render contact link', () => {
    renderWithAuth();
    const link = screen.getByText('Contact');
    expect(link.getAttribute('href')).toBe('/');
  });

  it('should render login link when user is not logged in', () => {
    renderWithAuth();
    expect(screen.getByText('Login')).toBeDefined();
  });

  it('should render phone number', () => {
    renderWithAuth();
    expect(screen.getByText('0942 827 631')).toBeDefined();
  });

  it('should render the CartIcon component', () => {
    renderWithAuth();
    expect(screen.getByTestId('cart-icon')).toBeDefined();
  });

  it('should render the mobile Menu component', () => {
    renderWithAuth();
    expect(screen.getByTestId('mobile-menu')).toBeDefined();
  });
});
