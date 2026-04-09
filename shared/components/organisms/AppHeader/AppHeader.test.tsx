import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppHeader } from './AppHeader';

/** Mock LogoutButton so it renders a simple button */
jest.mock('@/shared/components/atoms/Button/LogoutButton', () => {
  return function MockLogoutButton() {
    return <button>Log out</button>;
  };
});

/** Mock LocaleSwitcher */
jest.mock('@/shared/components/atoms', () => ({
  LocaleSwitcher: ({ locale }: { locale: string }) => (
    <div data-testid="locale-switcher">{locale}</div>
  ),
  ThemeToggle: ({
    resolvedTheme,
    onToggle,
  }: {
    resolvedTheme: string;
    onToggle: () => void;
  }) => (
    <button data-testid="theme-toggle" onClick={onToggle}>
      {resolvedTheme}
    </button>
  ),
}));

/** Shared default props */
const defaultProps = {
  left: <h1>Page Title</h1>,
  locale: 'en' as const,
  onLocaleChange: jest.fn(),
  resolvedTheme: 'dark' as const,
  onToggleTheme: jest.fn(),
};

describe('AppHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the left slot content', () => {
    render(<AppHeader {...defaultProps} />);
    expect(screen.getByText('Page Title')).toBeInTheDocument();
  });

  it('renders LocaleSwitcher and ThemeToggle', () => {
    render(<AppHeader {...defaultProps} />);
    expect(screen.getByTestId('locale-switcher')).toBeInTheDocument();
    expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
  });

  it('renders LogoutButton by default (showLogout=true)', () => {
    render(<AppHeader {...defaultProps} />);
    expect(screen.getByText('Log out')).toBeInTheDocument();
  });

  it('hides LogoutButton when showLogout is false', () => {
    render(<AppHeader {...defaultProps} showLogout={false} />);
    expect(screen.queryByText('Log out')).not.toBeInTheDocument();
  });

  it('renders actions when provided', () => {
    render(
      <AppHeader
        {...defaultProps}
        actions={<button>Create</button>}
      />,
    );
    expect(screen.getByText('Create')).toBeInTheDocument();
  });

  it('does NOT render actions slot when not provided', () => {
    render(<AppHeader {...defaultProps} />);
    expect(screen.queryByText('Create')).not.toBeInTheDocument();
  });

  it('calls onToggleTheme when ThemeToggle is clicked', () => {
    const onToggleTheme = jest.fn();
    render(<AppHeader {...defaultProps} onToggleTheme={onToggleTheme} />);
    fireEvent.click(screen.getByTestId('theme-toggle'));
    expect(onToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('renders as a semantic <header> element', () => {
    const { container } = render(<AppHeader {...defaultProps} />);
    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();
  });
});
