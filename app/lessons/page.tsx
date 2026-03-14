import LessonsPage from '@/app/modules/lesson/ui/pages';

/**
 * Entry page component for the '/lessons' route.
 * Delegates rendering to the Lessons module page.
 * @returns Lessons list page component
 */
export default function Page(): React.JSX.Element {
  return <LessonsPage />;
}
