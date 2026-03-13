import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LocaleSwitcher from './LocaleSwitcher';

describe('LocaleSwitcher atom', () => {
  it('should render both EN and VI buttons', () => {
    const handleLocaleChange = jest.fn();
    render(<LocaleSwitcher locale="en" onLocaleChange={handleLocaleChange} />);
    
    expect(screen.getByRole('button', { name: /switch to english/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /chuyển sang tiếng việt/i })).toBeInTheDocument();
  });

  it('should highlight the active locale (EN)', () => {
    const handleLocaleChange = jest.fn();
    render(<LocaleSwitcher locale="en" onLocaleChange={handleLocaleChange} />);
    
    const enButton = screen.getByRole('button', { name: /switch to english/i });
    const viButton = screen.getByRole('button', { name: /chuyển sang tiếng việt/i });

    expect(enButton).toHaveClass('bg-accent-primary', 'text-white');
    expect(viButton).toHaveClass('text-foreground-secondary');
  });

  it('should highlight the active locale (VI)', () => {
    const handleLocaleChange = jest.fn();
    render(<LocaleSwitcher locale="vi" onLocaleChange={handleLocaleChange} />);
    
    const enButton = screen.getByRole('button', { name: /switch to english/i });
    const viButton = screen.getByRole('button', { name: /chuyển sang tiếng việt/i });

    expect(viButton).toHaveClass('bg-accent-primary', 'text-white');
    expect(enButton).toHaveClass('text-foreground-secondary');
  });

  it('should call onLocaleChange when a button is clicked', async () => {
    const handleLocaleChange = jest.fn();
    render(<LocaleSwitcher locale="en" onLocaleChange={handleLocaleChange} />);
    
    // Click VI button
    await userEvent.click(screen.getByRole('button', { name: /chuyển sang tiếng việt/i }));
    expect(handleLocaleChange).toHaveBeenCalledWith('vi');

    // Click EN button
    await userEvent.click(screen.getByRole('button', { name: /switch to english/i }));
    expect(handleLocaleChange).toHaveBeenCalledWith('en');
  });
});
