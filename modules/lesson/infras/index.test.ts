import { getLessonsFromLocalStorage, saveLessonsToLocalStorage, updateLessonInSupabase } from './index';
import type { ILesson } from '@/modules/lesson/core/models';

/**
 * Mock Supabase client used across all infras tests.
 */
const mockEq = jest.fn();
const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
const mockUpdate = jest.fn();
const mockInsert = jest.fn();
const mockFrom = jest.fn(() => ({
  select: mockSelect,
  insert: mockInsert,
  update: mockUpdate,
}));

jest.mock('@/shared/utils/supabase/client', () => ({
  createClient: () => ({
    from: mockFrom,
  }),
}));

jest.mock('@/shared/hooks/getUserLocal', () => ({
  getUserLocal: () => ({
    user: null,
    userId: 'test-user-id',
    refreshToken: 'test-token',
  }),
}));

describe('Lesson Infras – Supabase operations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /** Shared mock lesson fixture */
  const mockLesson: ILesson = {
    id: 'lesson-001',
    topic: 'Test topic',
    date: '2023-01-01T09:00:00.000Z',
    participantName: 'Test User',
    isPinned: false,
    isFavorite: false,
    priority: 'Low',
    notes: '',
    vocabularies: [],
  };

  describe('getLessonsFromLocalStorage', () => {
    it('returns lessons with nested vocabularies on success', async () => {
      const supabaseRow = {
        ...mockLesson,
        vocabularies: [
          {
            id: 'v1',
            word: 'hello',
            ipa: '/həˈloʊ/',
            partOfSpeech: 'interjection',
            meaning: 'A greeting',
            translation: 'Xin chào',
            pronunciation: 'heh-LOH',
            example: 'Hello there!',
          },
        ],
      };

      mockEq.mockResolvedValueOnce({ data: [supabaseRow], error: null });

      const result = await getLessonsFromLocalStorage();

      expect(mockFrom).toHaveBeenCalledWith('lessons');
      expect(mockSelect).toHaveBeenCalledWith('*, vocabularies(*), summaries(*)');
      expect(mockEq).toHaveBeenCalledWith('createdBy', 'test-user-id');
      expect(result).toHaveLength(1);
      expect(result[0].vocabularies).toHaveLength(1);
      expect(result[0].vocabularies[0].word).toBe('hello');
    });

    it('returns empty array on Supabase error', async () => {
      mockEq.mockResolvedValueOnce({
        data: null,
        error: { message: 'Network error' },
      });

      const result = await getLessonsFromLocalStorage();

      expect(result).toEqual([]);
    });
  });

  describe('saveLessonsToLocalStorage', () => {
    it('returns success when insert succeeds', async () => {
      mockInsert.mockResolvedValueOnce({ data: null, error: null });

      const result = await saveLessonsToLocalStorage(mockLesson);

      expect(result.success).toBe(true);
    });

    it('returns error result when insert fails', async () => {
      mockInsert.mockResolvedValueOnce({
        data: null,
        error: { message: 'Conflict' },
      });

      const result = await saveLessonsToLocalStorage(mockLesson);

      expect(result.success).toBe(false);
      expect(result.error).toBe(true);
    });
  });

  describe('updateLessonInSupabase', () => {
    it('returns success when update succeeds', async () => {
      mockUpdate.mockReturnValueOnce({
        eq: jest.fn().mockReturnValueOnce({
          eq: jest.fn().mockResolvedValueOnce({ data: null, error: null }),
        }),
      });

      const { id, ...lessonData } = mockLesson;
      const result = await updateLessonInSupabase(id, lessonData);

      expect(result.success).toBe(true);
    });

    it('returns error result when update fails', async () => {
      mockUpdate.mockReturnValueOnce({
        eq: jest.fn().mockReturnValueOnce({
          eq: jest.fn().mockResolvedValueOnce({
            data: null,
            error: { message: 'Not found' },
          }),
        }),
      });

      const { id, ...lessonData } = mockLesson;
      const result = await updateLessonInSupabase(id, lessonData);

      expect(result.success).toBe(false);
      expect(result.error).toBe(true);
    });
  });
});
