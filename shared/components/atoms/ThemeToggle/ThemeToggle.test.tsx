import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeToggle from './ThemeToggle';

describe('ThemeToggle atom', () => {
  it('should display the dark mode icon when resolvedTheme is dark', () => {
    const handleToggle = jest.fn();
    render(<ThemeToggle resolvedTheme="dark" onToggle={handleToggle} />);
    
    const button = screen.getByRole('button', { name: /switch to light mode/i });
    expect(button).toBeInTheDocument();
    
    // Contains moon icon paths
    expect(button.innerHTML).toContain('circle cx="12" cy="12" r="4"');
  });

  it('should display the light mode icon when resolvedTheme is light', () => {
    const handleToggle = jest.fn();
    render(<ThemeToggle resolvedTheme="light" onToggle={handleToggle} />);
    
    const button = screen.getByRole('button', { name: /switch to dark mode/i });
    expect(button).toBeInTheDocument();
    
    // Contains sun icon paths
    expect(button.innerHTML).toContain('M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z');
  });

  it('should call onToggle when clicked', async () => {
    const handleToggle = jest.fn();
    render(<ThemeToggle resolvedTheme="dark" onToggle={handleToggle} />);
    
    const button = screen.getByRole('button');
    await userEvent.click(button);
    
    expect(handleToggle).toHaveBeenCalledTimes(1);
  });
});
