import { getLessonsFromLocalStorage, saveLessonsToLocalStorage } from './index';
import type { ILesson } from '@/app/modules/lesson/core/models';

describe('LocalStorage Infras', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockLessons: ILesson[] = [
    {
      id: 'lesson-0',
      topic: 'Test topic',
      date: '2023-01-01',
      participantName: 'Test',
      isPinned: false,
      isFavorite: false,
      priority: 'Low',
      notes: '',
      links: [],
      vocabularies: [],
      questions: [],
    },
  ];

  it('getLessonsFromLocalStorage returns empty array when empty', () => {
    expect(getLessonsFromLocalStorage()).toEqual([]);
  });

  it('getLessonsFromLocalStorage returns parseable data', () => {
    localStorage.setItem('lingonote_lessons', JSON.stringify(mockLessons));
    expect(getLessonsFromLocalStorage()).toEqual(mockLessons);
  });

  it('getLessonsFromLocalStorage handles invalid json gracefully', () => {
    localStorage.setItem('lingonote_lessons', 'unparseable');
    expect(getLessonsFromLocalStorage()).toEqual([]);
  });

  it('saveLessonsToLocalStorage saves data successfully', () => {
    saveLessonsToLocalStorage(mockLessons);
    const savedData = localStorage.getItem('lingonote_lessons');
    expect(savedData).toBeTruthy();
    expect(JSON.parse(savedData as string)).toEqual(mockLessons);
  });
});
