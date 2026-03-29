'use client';

import { AuthForm } from '../components/AuthForm';

/**
 * Main auth page component for the Auth module.
 * Composes the AuthForm component inside a semantic main element.
 * @returns The rendered Auth page view
 */
export default function AuthPage(): React.JSX.Element {
  return (
    <main>
      <AuthForm />
    </main>
  );
}
