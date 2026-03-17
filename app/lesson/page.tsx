import LessonsPage from '@/app/modules/lesson/ui/pages';

/**
 * Backward-compatible entry page for the '/lesson' route.
 * Delegates rendering to the Lessons module list page.
 * @returns Lessons list page component
 */
export default function Page(): React.JSX.Element {
  return <LessonsPage />;
}
