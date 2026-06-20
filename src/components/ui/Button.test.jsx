import { render, screen } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  it('renders the button with children', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('applies the correct variant class', () => {
    render(<Button variant="outline">Outline</Button>);
    const button = screen.getByText('Outline');
    // Button.jsx uses 'theme-outline-button' for the outline variant
    expect(button).toHaveClass('theme-outline-button');
  });

  it('can be disabled', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText('Disabled')).toBeDisabled();
  });
});
