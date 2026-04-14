import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { AuthForm } from './AuthForm';

/* ============================================================
 * Mocks
 * ============================================================ */

const mockPush = jest.fn();
const mockRefresh = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}));

const mockHandleSubmit = jest.fn();
const mockToggleAuthMode = jest.fn();
const mockHandleProviderSignIn = jest.fn();

jest.mock('../hooks/useAuthPage', () => ({
  useAuthPage: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        app_name: 'LingoNote',
        app_tagline: 'Your Language Learning Companion',
        page_title: 'Welcome Back',
        page_subtitle_sign_in: 'Sign in to continue',
        page_subtitle_register: 'Create an account',
        label_email: 'Email Address',
        label_password: 'Password',
        label_display_name: 'Display Name',
        placeholder_email: 'name@example.com',
        placeholder_password: 'Enter your password',
        placeholder_display_name: 'Your display name',
        btn_sign_in: 'Sign In',
        btn_register: 'Create Account',
        btn_loading: 'Please wait...',
        toggle_to_register: "Don't have an account?",
        toggle_to_sign_in: 'Already have an account?',
        link_register: 'Sign up',
        link_sign_in: 'Sign in',
        error_unexpected: 'An unexpected error occurred.',
        divider_or: 'or continue with',
        provider_google: 'Continue with Google',
        provider_github: 'Continue with GitHub',
      };
      return translations[key] ?? key;
    },
    isSignIn: mockToggleAuthMode.mock.calls.length % 2 === 0,
    isLoading: false,
    error: null,
    toggleAuthMode: mockToggleAuthMode,
    handleSubmit: mockHandleSubmit,
    handleProviderSignIn: mockHandleProviderSignIn,
  }),
}));

describe('AuthForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the brand name and tagline', () => {
    render(<AuthForm />);

    expect(screen.getByText('LingoNote')).toBeInTheDocument();
    expect(screen.getByText('Your Language Learning Companion')).toBeInTheDocument();
  });

  it('renders sign in form by default', () => {
    render(<AuthForm />);

    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('renders provider buttons', () => {
    render(<AuthForm />);

    expect(screen.getByText('Continue with Google')).toBeInTheDocument();
    expect(screen.getByText('Continue with GitHub')).toBeInTheDocument();
  });

  it('renders the divider text', () => {
    render(<AuthForm />);

    expect(screen.getByText('or continue with')).toBeInTheDocument();
  });

  it('calls toggleAuthMode when toggle link is clicked', () => {
    render(<AuthForm />);

    const toggleLink = screen.getByText('Sign up');
    fireEvent.click(toggleLink);

    expect(mockToggleAuthMode).toHaveBeenCalledTimes(1);
  });

  it('calls handleSubmit with form data on submit', async () => {
    mockHandleSubmit.mockResolvedValue({ success: true });
    render(<AuthForm />);

    fireEvent.change(screen.getByLabelText('Email Address'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(mockHandleSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('redirects to home on successful submission', async () => {
    mockHandleSubmit.mockResolvedValue({ success: true });
    render(<AuthForm />);

    fireEvent.change(screen.getByLabelText('Email Address'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it('does not redirect when submission fails', async () => {
    mockHandleSubmit.mockResolvedValue({ success: false, error: 'Bad creds' });
    render(<AuthForm />);

    fireEvent.change(screen.getByLabelText('Email Address'), {
      target: { value: 'bad@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrongpass' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it('calls handleProviderSignIn with "google" when Google button is clicked', () => {
    render(<AuthForm />);

    const googleButton = screen.getByRole('button', { name: /Continue with Google/i });
    expect(googleButton).not.toBeDisabled();
    fireEvent.click(googleButton);

    expect(mockHandleProviderSignIn).toHaveBeenCalledTimes(1);
    expect(mockHandleProviderSignIn).toHaveBeenCalledWith('google');
  });

  it('renders the GitHub button as disabled', () => {
    render(<AuthForm />);

    const githubButton = screen.getByRole('button', { name: /Continue with GitHub/i });
    expect(githubButton).toBeDisabled();
  });

  it('renders Google button with unique id for browser testing', () => {
    render(<AuthForm />);

    const googleButton = document.getElementById('google-sign-in-btn');
    expect(googleButton).toBeInTheDocument();
  });
});
