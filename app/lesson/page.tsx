import LessonPage from '@/app/modules/lesson/ui/pages';

/**
 * Entry page component for the '/lesson' route.
 * Delegates all rendering to the Lesson module page.
 * @returns The Lesson page module component
 */
export default function Page(): React.JSX.Element {
  return <LessonPage />;
}
