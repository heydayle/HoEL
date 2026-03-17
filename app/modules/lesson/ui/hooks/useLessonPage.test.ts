import { renderHook, act } from '@testing-library/react';
import { useLessonPage } from './useLessonPage';
import { getLessonsFromLocalStorage, saveLessonsToLocalStorage } from '@/app/modules/lesson/infras';
import { LESSON_FALLBACK_DATA } from '@/app/modules/lesson/core/usecases';
import { useTheme, useLocale } from '@/app/shared/hooks';

jest.mock('@/app/modules/lesson/infras', () => ({
  getLessonsFromLocalStorage: jest.fn(),
  saveLessonsToLocalStorage: jest.fn(),
}));

jest.mock('@/app/shared/hooks', () => ({
  useTheme: jest.fn(),
  useLocale: jest.fn(),
}));

describe('useLessonPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (useTheme as jest.Mock).mockReturnValue({
      mode: 'light',
      resolvedTheme: 'light',
      setThemeMode: jest.fn(),
    });

    (useLocale as jest.Mock).mockReturnValue({
      locale: 'en',
      setLocale: jest.fn(),
      t: (key: string) => key,
    });
  });

  it('initializes with fallback data if local storage is empty', () => {
    (getLessonsFromLocalStorage as jest.Mock).mockReturnValue([]);

    const { result } = renderHook(() => useLessonPage());

    expect(result.current.displayedLessons).toEqual(LESSON_FALLBACK_DATA);
  });

  it('initializes with local storage data if available', () => {
    const mockLessons = [
      {
        id: '1',
        topic: 'Test',
        participantName: 'John',
        date: '2023-01-01',
        isPinned: false,
        isFavorite: false,
        priority: 'Low',
        notes: '',
        links: [],
        vocabularies: [],
        questions: []
      }
    ];
    (getLessonsFromLocalStorage as jest.Mock).mockReturnValue(mockLessons);

    const { result } = renderHook(() => useLessonPage());

    expect(result.current.displayedLessons).toEqual(mockLessons);
  });

  it('addLesson adds a new lesson and saves it to local storage', () => {
    (getLessonsFromLocalStorage as jest.Mock).mockReturnValue([]);
    const { result } = renderHook(() => useLessonPage());

    act(() => {
      result.current.addLesson({
        topic: 'New Tech Topic',
        participantName: 'Jane',
        date: '2027-01-02T00:00:00.000Z',
        isPinned: false,
        isFavorite: false,
        priority: 'Medium',
        notes: '',
        links: [],
        vocabularies: [],
        questions: []
      });
    });

    // Fallback data + 1 new item
    expect(result.current.displayedLessons.length).toBe(LESSON_FALLBACK_DATA.length + 1);
    expect(result.current.displayedLessons[0].topic).toBe('New Tech Topic');
    expect(saveLessonsToLocalStorage).toHaveBeenCalledWith(result.current.displayedLessons);
  });

  it('updates filters when calling update functions', () => {
    (getLessonsFromLocalStorage as jest.Mock).mockReturnValue([]);
    const { result } = renderHook(() => useLessonPage());

    act(() => {
      result.current.updateSearchTerm('search query');
      result.current.updatePinnedFilter(true);
      result.current.updateFavoriteFilter(true);
      result.current.updatePriorityFilter('High');
      result.current.updateStartDate('2023-01-01');
      result.current.updateEndDate('2023-12-31');
      result.current.updateSortBy('date_asc');
    });

    expect(result.current.filters).toMatchObject({
      searchTerm: 'search query',
      isPinned: true,
      isFavorite: true,
      priority: 'High',
      startDate: '2023-01-01',
      endDate: '2023-12-31',
      sortBy: 'date_asc',
    });

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.filters.searchTerm).toBe('');
  });

  it('toggles theme properly', () => {
    const mockSetThemeMode = jest.fn();
    (useTheme as jest.Mock).mockReturnValue({
      mode: 'system',
      resolvedTheme: 'dark',
      setThemeMode: mockSetThemeMode,
    });

    (getLessonsFromLocalStorage as jest.Mock).mockReturnValue([]);
    const { result } = renderHook(() => useLessonPage());

    act(() => {
      result.current.toggleTheme();
    });

    expect(mockSetThemeMode).toHaveBeenCalledWith('light');

    (useTheme as jest.Mock).mockReturnValue({
      mode: 'dark',
      resolvedTheme: 'dark',
      setThemeMode: mockSetThemeMode,
    });

    const { result: result2 } = renderHook(() => useLessonPage());

    act(() => {
      result2.current.toggleTheme();
    });

    expect(mockSetThemeMode).toHaveBeenCalledWith('light');
  });
});
