import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button atom', () => {
  it('should render correctly with default props', () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole('button', { name: /Click Me/i });
    expect(button).toBeInTheDocument();
    
    // Default size is md and variant is primary
    expect(button).toHaveClass('px-6', 'py-3', 'text-base');
    expect(button).toHaveClass('bg-accent-primary');
  });

  it('should render icon if provided', () => {
    const icon = <svg data-testid="test-icon" />;
    render(<Button icon={icon}>With Icon</Button>);
    
    const iconElement = screen.getByTestId('test-icon');
    expect(iconElement).toBeInTheDocument();
  });

  it('should render with different variants', () => {
    const { rerender } = render(<Button variant="secondary">Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-accent-secondary');

    rerender(<Button variant="ghost">Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-transparent', 'text-foreground');

    rerender(<Button variant="outline">Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('border', 'border-surface-border');
  });

  it('should render with different sizes', () => {
    const { rerender } = render(<Button size="sm">Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-4', 'py-2', 'text-sm');

    rerender(<Button size="lg">Button</Button>);
    expect(screen.getByRole('button')).toHaveClass('px-8', 'py-4', 'text-lg');
  });

  it('should be disabled when the disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('button')).toHaveClass('disabled:opacity-50');
  });

  it('should forward additional props to the button element', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} data-testid="click-btn">Click Me</Button>);
    
    await userEvent.click(screen.getByTestId('click-btn'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
