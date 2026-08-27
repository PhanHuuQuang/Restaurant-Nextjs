import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Price from '../Price';

vi.mock('next/image', () => ({
  default: () => null,
}));

describe('Price', () => {
  const baseProps = {
    id: 1,
    price: 24.9,
  };

  it('should render base price', () => {
    render(<Price {...baseProps} />);
    expect(screen.getByText('$24.90')).toBeDefined();
  });

  it('should render quantity controls', () => {
    render(<Price {...baseProps} />);
    expect(screen.getByText('Quantity')).toBeDefined();
    expect(screen.getByText('1')).toBeDefined();
  });

  it('should increment quantity when > button is clicked', () => {
    render(<Price {...baseProps} />);
    fireEvent.click(screen.getByText('>'));
    expect(screen.getByText('2')).toBeDefined();
  });

  it('should decrement quantity when < button is clicked', () => {
    render(<Price {...baseProps} />);
    fireEvent.click(screen.getByText('>'));
    fireEvent.click(screen.getByText('>'));
    fireEvent.click(screen.getByText('<'));
    expect(screen.getByText('2')).toBeDefined();
  });

  it('should wrap to 9 when decrementing below 1', () => {
    render(<Price {...baseProps} />);
    fireEvent.click(screen.getByText('<'));
    expect(screen.getByText('9')).toBeDefined();
  });

  it('should render Add to Cart button', () => {
    render(<Price {...baseProps} />);
    expect(screen.getByText('Add to Cart')).toBeDefined();
  });

  it('should render options when provided', () => {
    const options = [
      { title: 'Small', additionalPrice: 0 },
      { title: 'Large', additionalPrice: 4 },
    ];
    render(<Price {...baseProps} options={options} />);
    expect(screen.getByText('Small')).toBeDefined();
    expect(screen.getByText('Large')).toBeDefined();
  });

  it('should update total when option is selected', () => {
    const options = [
      { title: 'Small', additionalPrice: 0 },
      { title: 'Large', additionalPrice: 4 },
    ];
    render(<Price {...baseProps} options={options} />);
    fireEvent.click(screen.getByText('Large'));
    expect(screen.getByText('$28.90')).toBeDefined();
  });

  it('should update total when quantity changes with option', () => {
    const options = [
      { title: 'Small', additionalPrice: 0 },
      { title: 'Large', additionalPrice: 4 },
    ];
    render(<Price {...baseProps} options={options} />);
    fireEvent.click(screen.getByText('Large'));
    fireEvent.click(screen.getByText('>'));
    expect(screen.getByText('$57.80')).toBeDefined();
  });

  it('should update total when quantity changes without options', () => {
    render(<Price {...baseProps} />);
    fireEvent.click(screen.getByText('>'));
    expect(screen.getByText('$49.80')).toBeDefined();
  });
});
