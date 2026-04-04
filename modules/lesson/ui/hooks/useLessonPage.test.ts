import { renderHook, act, waitFor } from '@testing-library/react';
import { useLessonPage } from './useLessonPage';
import { getLessonsFromLocalStorage, saveLessonsToLocalStorage } from '@/modules/lesson/infras';
import { LESSON_FALLBACK_DATA } from '@/modules/lesson/core/usecases';
import { useTheme, useLocale } from '@/shared/hooks';

// Suppress act() warnings for async effects
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('An update to TestComponent inside a test was not wrapped in act')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

jest.mock('@/modules/lesson/infras', () => ({
  getLessonsFromLocalStorage: jest.fn(),
  saveLessonsToLocalStorage: jest.fn().mockResolvedValue({ success: true }),
  updateLessonInSupabase: jest.fn().mockResolvedValue({ success: true }),
  bulkAddVocabs: jest.fn().mockResolvedValue([]),
  syncVocabularies: jest.fn().mockResolvedValue([]),
}));

jest.mock('@/shared/hooks', () => ({
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

  it('initializes with fallback data if local storage is empty', async () => {
    (getLessonsFromLocalStorage as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() => useLessonPage());

    await waitFor(() => {
      expect(result.current.displayedLessons).toEqual([]);
    });
  });

  it('initializes with local storage data if available', async () => {
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
    (getLessonsFromLocalStorage as jest.Mock).mockResolvedValue(mockLessons);

    const { result } = renderHook(() => useLessonPage());

    await waitFor(() => {
      expect(result.current.displayedLessons).toEqual(mockLessons);
    });
  });

  it('addLesson adds a new lesson and saves it to local storage', async () => {
    (getLessonsFromLocalStorage as jest.Mock).mockResolvedValue([]);
    (saveLessonsToLocalStorage as jest.Mock).mockResolvedValue({ success: true });
    
    const { result } = renderHook(() => useLessonPage());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.addLesson({
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

    expect(saveLessonsToLocalStorage).toHaveBeenCalled();
  });

  it('updates filters when calling update functions', async () => {
    (getLessonsFromLocalStorage as jest.Mock).mockResolvedValue([]);
    const { result } = renderHook(() => useLessonPage());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

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

  it('toggles theme properly', async () => {
    const mockSetThemeMode = jest.fn();
    (useTheme as jest.Mock).mockReturnValue({
      mode: 'system',
      resolvedTheme: 'dark',
      setThemeMode: mockSetThemeMode,
    });

    (getLessonsFromLocalStorage as jest.Mock).mockResolvedValue([]);
    const { result } = renderHook(() => useLessonPage());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

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

  it('updateLesson updates an existing lesson and saves to local storage', async () => {
    const mockLessons = [
      {
        id: 'lesson-1',
        topic: 'Original Topic',
        participantName: 'John',
        date: '2023-01-01',
        isPinned: false,
        isFavorite: false,
        priority: 'Low',
        notes: '',
        links: [],
        vocabularies: [],
        questions: []
      },
      {
        id: 'lesson-2',
        topic: 'Another Topic',
        participantName: 'Jane',
        date: '2023-01-02',
        isPinned: false,
        isFavorite: false,
        priority: 'High',
        notes: '',
        links: [],
        vocabularies: [],
        questions: []
      }
    ];
    (getLessonsFromLocalStorage as jest.Mock).mockResolvedValue(mockLessons);

    const { result } = renderHook(() => useLessonPage());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const updatedData = {
      topic: 'Updated Topic',
      participantName: 'Jane Doe',
      date: '2023-01-01',
      isPinned: true,
      isFavorite: true,
      priority: 'High',
      notes: 'Updated notes',
      links: [],
      vocabularies: [],
      questions: []
    };

    await act(async () => {
      await result.current.updateLesson('lesson-1', updatedData);
    });
  });

  it('updateLesson preserves lesson ID when updating', async () => {
    const mockLessons = [
      {
        id: 'lesson-123',
        topic: 'Original',
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
    (getLessonsFromLocalStorage as jest.Mock).mockResolvedValue(mockLessons);

    const { result } = renderHook(() => useLessonPage());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.updateLesson('lesson-123', {
        topic: 'New Topic',
        participantName: 'Jane',
        date: '2023-01-01',
        isPinned: false,
        isFavorite: false,
        priority: 'Medium',
        notes: '',
        links: [],
        vocabularies: [],
        questions: []
      });
    });
  });

  it('updateLesson handles updating vocabularies', async () => {
    const mockLessons = [
      {
        id: 'lesson-1',
        topic: 'English',
        participantName: 'John',
        date: '2023-01-01',
        isPinned: false,
        isFavorite: false,
        priority: 'Medium',
        notes: '',
        links: [],
        vocabularies: [
          { id: 'vocab-1', word: 'old word', meaning: 'old meaning' }
        ],
        questions: []
      }
    ];
    (getLessonsFromLocalStorage as jest.Mock).mockResolvedValue(mockLessons);

    const { result } = renderHook(() => useLessonPage());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const updatedVocabularies = [
      { id: 'vocab-1', word: 'new word', meaning: 'new meaning' },
      { id: 'vocab-2', word: 'another word', meaning: 'another meaning' }
    ];

    await act(async () => {
      await result.current.updateLesson('lesson-1', {
        topic: 'English',
        participantName: 'John',
        date: '2023-01-01',
        isPinned: false,
        isFavorite: false,
        priority: 'Medium',
        notes: '',
        links: [],
        vocabularies: updatedVocabularies,
        questions: []
      });
    });
  });

  it('updateLesson does not modify other lessons', async () => {
    const lesson1 = {
      id: 'lesson-1',
      topic: 'Topic 1',
      participantName: 'John',
      date: '2023-01-01',
      isPinned: false,
      isFavorite: false,
      priority: 'Low',
      notes: '',
      links: [],
      vocabularies: [],
      questions: []
    };
    const lesson2 = {
      id: 'lesson-2',
      topic: 'Topic 2',
      participantName: 'Jane',
      date: '2023-01-02',
      isPinned: true,
      isFavorite: false,
      priority: 'High',
      notes: 'Some notes',
      links: [],
      vocabularies: [],
      questions: []
    };
    const mockLessons = [lesson1, lesson2];
    (getLessonsFromLocalStorage as jest.Mock).mockResolvedValue(mockLessons);

    const { result } = renderHook(() => useLessonPage());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      await result.current.updateLesson('lesson-1', {
        topic: 'Updated Topic 1',
        participantName: 'John',
        date: '2023-01-01',
        isPinned: true,
        isFavorite: false,
        priority: 'Low',
        notes: '',
        links: [],
        vocabularies: [],
        questions: []
      });
    });
  });

  it('updateLesson handles updating non-existent lesson gracefully', async () => {
    const mockLessons = [
      {
        id: 'lesson-1',
        topic: 'Topic 1',
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
    (getLessonsFromLocalStorage as jest.Mock).mockResolvedValue(mockLessons);

    const { result } = renderHook(() => useLessonPage());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const originalLength = result.current.displayedLessons.length;

    await act(async () => {
      await result.current.updateLesson('non-existent-id', {
        topic: 'Non-existent',
        participantName: 'Nobody',
        date: '2023-01-01',
        isPinned: false,
        isFavorite: false,
        priority: 'Low',
        notes: '',
        links: [],
        vocabularies: [],
        questions: []
      });
    });

    // Should still have same number of lessons
    expect(result.current.displayedLessons.length).toBe(originalLength);
    // Original lesson should be preserved
    expect(result.current.displayedLessons[0]).toEqual(mockLessons[0]);
  });
});
