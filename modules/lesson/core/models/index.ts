/**
 * Priority level for a lesson.
 */
export type LessonPriority = 'Low' | 'Medium' | 'High';

/**
 * Vocabulary entity stored inside a lesson.
 */
export interface IVocabulary {
  /** Unique vocabulary identifier */
  id: string;
  /** Word or phrase */
  word: string;
  /** International Phonetic Alphabet notation */
  ipa: string;
  /** Grammar class of the word */
  partOfSpeech: string;
  /** Definition in the target language */
  meaning: string;
  /** Translation in the native language */
  translation: string;
  /** Pronunciation notes or audio URL */
  pronunciation: string;
  /** Example sentence */
  example: string;
  /**
   * Transient UI-only flag indicating this entry is still being fetched.
   * Never persisted to the database.
   */
  _loading?: boolean;
  /**
   * Transient UI-only field showing the word currently being loaded.
   * Displayed on the skeleton card while the API call is in progress.
   */
  _loadingWord?: string;
}

/**
 * Vocabulary row as stored in the Supabase `vocabularies` table.
 * Extends the base IVocabulary with database-specific fields.
 */
export interface IVocabularyRow extends IVocabulary {
  /** Timestamp when the record was created */
  created_at: string;
  /** Foreign key linking to the parent lesson */
  lesson_id: string;
}

/**
 * Payload used to create a new vocabulary record in Supabase.
 * Omits auto-generated fields (`id`, `created_at`).
 */
export type IVocabularyCreatePayload = Omit<IVocabularyRow, 'id' | 'created_at'>;

/**
 * Payload used to update an existing vocabulary record.
 * All fields are optional except for the ones being changed.
 */
export type IVocabularyUpdatePayload = Partial<Omit<IVocabularyRow, 'id' | 'created_at'>>;

/**
 * Question and answer entity for lesson review.
 */
export interface IQuestion {
  /** Unique question identifier */
  id: string;
  /** Review question text */
  questionText: string;
  /** Corresponding answer text */
  answerText: string;
}

/**
 * Lesson entity used by the lesson tracker.
 */
export interface ILesson {
  /** Unique lesson identifier */
  id: string;
  /** ISO date of lesson */
  date: string;
  /** Main lesson topic */
  topic: string;
  /** Name of teacher/student based on mode */
  participantName: string;
  /** Whether this lesson is pinned */
  isPinned: boolean;
  /** Whether this lesson is marked favorite */
  isFavorite: boolean;
  /** Priority of the lesson */
  priority: LessonPriority;
  /** Long-form note content */
  notes: string;
  /** External reference links */
  // links: string[];
  /** Related vocabulary entries */
  vocabularies: IVocabulary[];
  /** Related Q&A entries */
  // questions: IQuestion[];
  /** Optional field to track which user created the lesson */
  createdBy?: string;
  /** Timestamp when the lesson record was created in the database */
  created_at?: string;
  /** Foreign key linking to the associated summary record */
  summary_id?: string;
}

/**
 * Summary numbers displayed on the lesson overview page.
 */
export interface ILessonStats {
  /** Total lessons count */
  totalLessons: number;
  /** Total vocab items across lessons */
  totalVocabularies: number;
  /** Total questions across lessons */
  totalQuestions: number;
}

export interface ISummaryLesson {
  id: string;
  paragraph: string;
  translate: string;
  question_1: string;
  question_2: string;
  question_3: string;
  lesson_id: string;
  created_at: string;
}

/**
 * Payload used to create a new summary lesson record in Supabase.
 * Omits auto-generated fields (`id`, `created_at`).
 */
export type ISummaryLessonCreatePayload = Omit<ISummaryLesson, 'id' | 'created_at'>;

/**
 * Payload used to update an existing summary lesson record.
 * All fields are optional except for the ones being changed.
 */
export type ISummaryLessonUpdatePayload = Partial<Omit<ISummaryLesson, 'id' | 'created_at'>>;

/**
 * Raw response structure from Dify API for vocabulary generation
 */
export interface IDifyVocabResponse {
  data: {
    outputs: {
      text_result: string;
    };
  };
}
