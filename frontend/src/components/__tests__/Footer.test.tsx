import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  },
}));

describe('Footer', () => {
  it('should render restaurant brand name', () => {
    render(<Footer />);
    expect(screen.getByText('RESTAURANT')).toBeDefined();
  });

  it('should render copyright text', () => {
    render(<Footer />);
    expect(screen.getByText('© ALL RIGHTS RESERVED.')).toBeDefined();
  });

  it('should link to homepage', () => {
    render(<Footer />);
    const link = screen.getByText('RESTAURANT');
    expect(link.getAttribute('href')).toBe('/');
  });
});
