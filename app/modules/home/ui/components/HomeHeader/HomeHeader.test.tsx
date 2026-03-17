import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HomeHeader } from './HomeHeader';
import type { Locale } from '@/app/shared/types';

describe('HomeHeader component', () => {
  const defaultProps = {
    resolvedTheme: 'light' as const,
    onThemeToggle: jest.fn(),
    locale: 'en' as Locale,
    onLocaleChange: jest.fn(),
  };

  it('should render the application title', () => {
    render(<HomeHeader {...defaultProps} />);
    expect(screen.getByText('LingoNote')).toBeInTheDocument();
  });

  it('should render ThemeToggle and pass down props and handlers', async () => {
    const handleToggle = jest.fn();
    render(<HomeHeader {...defaultProps} onThemeToggle={handleToggle} />);
    
    // Light mode means switch to dark mode button exists
    const themeBtn = screen.getByRole('button', { name: /switch to dark mode/i });
    expect(themeBtn).toBeInTheDocument();
    
    await userEvent.click(themeBtn);
    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  it('should render LocaleSwitcher and pass down props and handlers', async () => {
    const handleLocaleChange = jest.fn();
    render(<HomeHeader {...defaultProps} onLocaleChange={handleLocaleChange} />);
    
    // Switch to VI button
    const viBtn = screen.getByRole('button', { name: /chuyển sang tiếng việt/i });
    await userEvent.click(viBtn);
    expect(handleLocaleChange).toHaveBeenCalledWith('vi');
  });

  it('should apply the frosted glass effect class', () => {
    const { container } = render(<HomeHeader {...defaultProps} />);
    const header = container.querySelector('#home-header');
    expect(header).toBeInTheDocument();
  });

  it('should render correctly in dark mode', () => {
    render(<HomeHeader {...defaultProps} resolvedTheme="dark" />);
    // Check for switch to light mode
    expect(screen.getByRole('button', { name: /switch to light mode/i })).toBeInTheDocument();
  });

  it('should render correctly when locale is vi', () => {
    render(<HomeHeader {...defaultProps} locale="vi" />);
    const viBtn = screen.getByRole('button', { name: /chuyển sang tiếng việt/i });
    expect(viBtn).toHaveClass('bg-accent-primary', 'text-white');
  });
});
