import HomePage from "@/modules/home/ui/pages";

/**
 * Root page component for the '/' route.
 * Acts as an entry point that delegates rendering to the Home module.
 * @returns The Home page module component
 */
export default function Page(): React.JSX.Element {
  return <HomePage />;
}
