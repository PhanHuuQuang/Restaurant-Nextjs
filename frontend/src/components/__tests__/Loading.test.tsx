import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Loading from '../Loading';

describe('Loading', () => {
  it('should render loading text', () => {
    render(<Loading />);
    expect(screen.getByText('Loading...')).toBeDefined();
  });

  it('should have correct styling', () => {
    render(<Loading />);
    const el = screen.getByText('Loading...');
    expect(el.className).toContain('text-red-500');
  });
});
