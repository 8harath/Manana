import { render, screen } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('applies the variant and size classes', () => {
    render(<Button variant="destructive" size="lg">Delete</Button>);
    const btn = screen.getByRole('button', { name: /delete/i });
    expect(btn.className).toMatch(/bg-destructive/);
    expect(btn.className).toMatch(/h-11/);
  });
}); 