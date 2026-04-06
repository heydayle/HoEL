import { getLessonByIdPublic } from '@/modules/lesson/infras';
import { act, renderHook } from '@testing-library/react';
import { usePublicLessonDetail } from './usePublicLessonDetail';
jest.mock('@/modules/lesson/infras', () => ({
  getLessonByIdPublic: jest.fn(),
}));
const mockGetLessonByIdPublic = getLessonByIdPublic as jest.MockedFunction<
  typeof getLessonByIdPublic
>;
/** Minimal ILesson stub for tests */
const mockLesson = {
  id: 'lesson-123',
  date: '2024-01-15T09:00:00.000Z',
  topic: 'Present Perfect',
  participantName: 'Anna',
  isPinned: false,
  isFavorite: false,
  priority: 'Medium' as const,
  notes: 'Great session!',
  vocabularies: [],
};
describe('usePublicLessonDetail', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should initialise with isLoading=true and lesson=null', () => {
    mockGetLessonByIdPublic.mockResolvedValue(null);
    const { result } = renderHook(() => usePublicLessonDetail('lesson-123'));
    expect(result.current.isLoading).toBe(true);
    expect(result.current.lesson).toBeNull();
    expect(result.current.error).toBeNull();
  });
  it('should set lesson on successful fetch', async () => {
    mockGetLessonByIdPublic.mockResolvedValue(mockLesson);
    const { result } = renderHook(() => usePublicLessonDetail('lesson-123'));
    await act(async () => {
      await result.current.fetchPublicLesson();
    });
    expect(result.current.lesson).toEqual(mockLesson);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });
  it('should set error when lesson is not found', async () => {
    mockGetLessonByIdPublic.mockResolvedValue(null);
    const { result } = renderHook(() => usePublicLessonDetail('unknown-id'));
    await act(async () => {
      await result.current.fetchPublicLesson();
    });
    expect(result.current.lesson).toBeNull();
    expect(result.current.error).toBe('Lesson not found');
    expect(result.current.isLoading).toBe(false);
  });
  it('should set error message when fetch throws', async () => {
    mockGetLessonByIdPublic.mockRejectedValue(new Error('Network failure'));
    const { result } = renderHook(() => usePublicLessonDetail('lesson-123'));
    await act(async () => {
      await result.current.fetchPublicLesson();
    });
    expect(result.current.error).toBe('Network failure');
    expect(result.current.isLoading).toBe(false);
  });
  it('should reset error on subsequent successful fetch', async () => {
    mockGetLessonByIdPublic
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce(mockLesson);
    const { result } = renderHook(() => usePublicLessonDetail('lesson-123'));
    await act(async () => {
      await result.current.fetchPublicLesson();
    });
    expect(result.current.error).toBe('fail');
    await act(async () => {
      await result.current.fetchPublicLesson();
    });
    expect(result.current.error).toBeNull();
    expect(result.current.lesson).toEqual(mockLesson);
  });
  it('should call getLessonByIdPublic with the provided lessonId', async () => {
    mockGetLessonByIdPublic.mockResolvedValue(mockLesson);
    const { result } = renderHook(() => usePublicLessonDetail('lesson-abc'));
    await act(async () => {
      await result.current.fetchPublicLesson();
    });
    expect(mockGetLessonByIdPublic).toHaveBeenCalledWith('lesson-abc');
  });
});