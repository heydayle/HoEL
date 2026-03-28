import AuthPage from '@/app/modules/auth/ui/pages';

/**
 * Entry point for the /auth route in the Next.js App Router.
 * Delegates rendering to the AuthPage module component.
 * @returns The auth page component
 */
export default function Page(): React.JSX.Element {
  return <AuthPage />;
}
