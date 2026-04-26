import { vi, type Mock } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLessonMutations } from './useLessonMutations';
import {
  saveLessonsToLocalStorage,
  updateLessonInSupabase,
  deleteLessonFromSupabase,
} from '@/modules/lesson/infras';
import { getUserLocal } from '@/shared/hooks/getUserLocal';
import { toast } from 'sonner';

vi.mock('@/modules/lesson/infras', () => ({
  saveLessonsToLocalStorage: vi.fn().mockResolvedValue({ success: true }),
  updateLessonInSupabase: vi.fn().mockResolvedValue({ success: true }),
  deleteLessonFromSupabase: vi.fn().mockResolvedValue({ success: true }),
  getLessonsFromLocalStorage: vi.fn().mockResolvedValue([]),
}));

vi.mock('@/modules/lesson/infras/vocabularyApi', () => ({
  bulkAddVocabs: vi.fn().mockResolvedValue([]),
  syncVocabularies: vi.fn().mockResolvedValue([]),
  getVocabsByLesson: vi.fn().mockResolvedValue([]),
}));

import { bulkAddVocabs, syncVocabularies } from '@/modules/lesson/infras/vocabularyApi';

vi.mock('@/shared/hooks/getUserLocal', () => ({
  getUserLocal: vi.fn().mockReturnValue({ user: null, userId: 'test-user-id' }),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('uuid', () => ({
  v4: vi.fn().mockReturnValue('mock-uuid-123'),
}));

/** Passthrough translation function */
const mockT = (key: string): string => key;

describe('useLessonMutations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('addLesson', () => {
    it('creates a lesson and returns the UUID on success', async () => {
      const { result } = renderHook(() => useLessonMutations(mockT));

      let lessonId: string | null = null;

      await act(async () => {
        lessonId = await result.current.addLesson({
          topic: 'Test Topic',
          participantName: 'Jane',
          date: '2027-01-02T00:00:00.000Z',
          isPinned: false,
          isFavorite: false,
          priority: 'Medium',
          notes: '',
          vocabularies: [],
        });
      });

      expect(lessonId).toBe('mock-uuid-123');
      expect(saveLessonsToLocalStorage).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'mock-uuid-123',
          topic: 'Test Topic',
          createdBy: 'test-user-id',
        }),
      );
      expect(toast.success).toHaveBeenCalledWith('lesson_created_toast');
    });

    it('returns null and shows error toast on failure', async () => {
      (saveLessonsToLocalStorage as Mock).mockResolvedValue({ success: false });

      const { result } = renderHook(() => useLessonMutations(mockT));

      let lessonId: string | null = null;

      await act(async () => {
        lessonId = await result.current.addLesson({
          topic: 'Test',
          participantName: 'Jane',
          date: '2027-01-02',
          isPinned: false,
          isFavorite: false,
          priority: 'Low',
          notes: '',
          vocabularies: [],
        });
      });

      expect(lessonId).toBeNull();
      expect(toast.error).toHaveBeenCalledWith('lesson_save_error_toast');
    });

    it('bulk-inserts vocabularies after lesson creation', async () => {
      (saveLessonsToLocalStorage as Mock).mockResolvedValue({ success: true });
      (bulkAddVocabs as Mock).mockResolvedValue([{ id: 'v1' }]);

      const { result } = renderHook(() => useLessonMutations(mockT));

      await act(async () => {
        await result.current.addLesson({
          topic: 'Vocab Test',
          participantName: 'Jane',
          date: '2027-01-02',
          isPinned: false,
          isFavorite: false,
          priority: 'Low',
          notes: '',
          vocabularies: [
            {
              id: 'temp-1',
              word: 'hello',
              ipa: '/hɛˈloʊ/',
              partOfSpeech: 'noun',
              meaning: 'a greeting',
              translation: 'xin chào',
              pronunciation: 'heh-loh',
              example: 'Hello world!',
            },
          ],
        });
      });

      expect(bulkAddVocabs).toHaveBeenCalledWith([
        expect.objectContaining({
          word: 'hello',
          lesson_id: 'mock-uuid-123',
        }),
      ]);
    });

    it('manages isAdding loading state correctly', async () => {
      const { result } = renderHook(() => useLessonMutations(mockT));

      expect(result.current.isAdding).toBe(false);

      await act(async () => {
        await result.current.addLesson({
          topic: 'Test',
          participantName: 'Jane',
          date: '2027-01-02',
          isPinned: false,
          isFavorite: false,
          priority: 'Low',
          notes: '',
          vocabularies: [],
        });
      });

      expect(result.current.isAdding).toBe(false);
    });

    it('handles thrown errors gracefully', async () => {
      (saveLessonsToLocalStorage as Mock).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useLessonMutations(mockT));

      let lessonId: string | null = null;

      await act(async () => {
        lessonId = await result.current.addLesson({
          topic: 'Test',
          participantName: 'Jane',
          date: '2027-01-02',
          isPinned: false,
          isFavorite: false,
          priority: 'Low',
          notes: '',
          vocabularies: [],
        });
      });

      expect(lessonId).toBeNull();
      expect(toast.error).toHaveBeenCalledWith('Network error');
    });
  });

  describe('updateLesson', () => {
    it('updates lesson metadata and syncs vocabularies', async () => {
      const { result } = renderHook(() => useLessonMutations(mockT));

      await act(async () => {
        await result.current.updateLesson('lesson-1', {
          topic: 'Updated Topic',
          participantName: 'Jane',
          date: '2027-01-02',
          isPinned: false,
          isFavorite: false,
          priority: 'High',
          notes: 'Updated notes',
          vocabularies: [
            {
              id: 'v1',
              word: 'test',
              ipa: '/test/',
              partOfSpeech: 'noun',
              meaning: 'a test',
              translation: 'thử nghiệm',
              pronunciation: 'test',
              example: 'This is a test.',
            },
          ],
        });
      });

      expect(updateLessonInSupabase).toHaveBeenCalledWith(
        'lesson-1',
        expect.objectContaining({ topic: 'Updated Topic' }),
      );
      expect(syncVocabularies).toHaveBeenCalledWith(
        'lesson-1',
        expect.arrayContaining([
          expect.objectContaining({ word: 'test', lesson_id: 'lesson-1' }),
        ]),
      );
      expect(toast.success).toHaveBeenCalledWith('lesson_updated_toast');
    });

    it('shows error toast when update fails', async () => {
      (updateLessonInSupabase as Mock).mockResolvedValue({ success: false });

      const { result } = renderHook(() => useLessonMutations(mockT));

      await act(async () => {
        await result.current.updateLesson('lesson-1', {
          topic: 'Test',
          participantName: 'Jane',
          date: '2027-01-02',
          isPinned: false,
          isFavorite: false,
          priority: 'Low',
          notes: '',
          vocabularies: [],
        });
      });

      expect(toast.error).toHaveBeenCalledWith('lesson_save_error_toast');
      expect(syncVocabularies).not.toHaveBeenCalled();
    });

    it('manages isUpdating loading state correctly', async () => {
      const { result } = renderHook(() => useLessonMutations(mockT));

      expect(result.current.isUpdating).toBe(false);

      await act(async () => {
        await result.current.updateLesson('lesson-1', {
          topic: 'Test',
          participantName: 'Jane',
          date: '2027-01-02',
          isPinned: false,
          isFavorite: false,
          priority: 'Low',
          notes: '',
          vocabularies: [],
        });
      });

      expect(result.current.isUpdating).toBe(false);
    });

    it('filters out empty-word vocabularies before syncing', async () => {
      (updateLessonInSupabase as Mock).mockResolvedValue({ success: true });
      const { result } = renderHook(() => useLessonMutations(mockT));

      await act(async () => {
        await result.current.updateLesson('lesson-1', {
          topic: 'Test',
          participantName: 'Jane',
          date: '2027-01-02',
          isPinned: false,
          isFavorite: false,
          priority: 'Low',
          notes: '',
          vocabularies: [
            {
              id: 'v1',
              word: 'valid',
              ipa: '',
              partOfSpeech: '',
              meaning: '',
              translation: '',
              pronunciation: '',
              example: '',
            },
            {
              id: 'v2',
              word: '   ',
              ipa: '',
              partOfSpeech: '',
              meaning: '',
              translation: '',
              pronunciation: '',
              example: '',
            },
          ],
        });
      });

      const syncPayloads = (syncVocabularies as Mock).mock.calls[0][1];
      expect(syncPayloads).toHaveLength(1);
      expect(syncPayloads[0].word).toBe('valid');
    });
  });

  describe('deleteLesson', () => {
    it('deletes a lesson and returns true on success', async () => {
      const { result } = renderHook(() => useLessonMutations(mockT));

      let success = false;

      await act(async () => {
        success = await result.current.deleteLesson('lesson-1');
      });

      expect(success).toBe(true);
      expect(deleteLessonFromSupabase).toHaveBeenCalledWith('lesson-1');
      expect(toast.success).toHaveBeenCalledWith('lesson_deleted_toast');
    });

    it('returns false and shows error toast when deletion fails', async () => {
      (deleteLessonFromSupabase as Mock).mockResolvedValue({ success: false });

      const { result } = renderHook(() => useLessonMutations(mockT));

      let success = false;

      await act(async () => {
        success = await result.current.deleteLesson('lesson-1');
      });

      expect(success).toBe(false);
      expect(toast.error).toHaveBeenCalledWith('lesson_delete_error');
    });

    it('handles thrown errors gracefully', async () => {
      (deleteLessonFromSupabase as Mock).mockRejectedValue(new Error('DB error'));

      const { result } = renderHook(() => useLessonMutations(mockT));

      let success = false;

      await act(async () => {
        success = await result.current.deleteLesson('lesson-1');
      });

      expect(success).toBe(false);
      expect(toast.error).toHaveBeenCalledWith('DB error');
    });
  });
});
