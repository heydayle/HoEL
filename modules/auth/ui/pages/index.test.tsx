import { vi } from 'vitest'
import { render, screen } from '@testing-library/react';

import AuthPage from './index';

vi.mock('../components/AuthForm', () => ({
  AuthForm: () => <div data-testid="auth-form-mock">Auth Form Mock</div>,
}));

describe('AuthPage', () => {
  it('renders a main semantic element wrapping AuthForm', () => {
    render(<AuthPage />);

    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByTestId('auth-form-mock')).toBeInTheDocument();
  });
});
