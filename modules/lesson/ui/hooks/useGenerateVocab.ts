import { useState } from 'react';
import { executeGenerateVocab } from '../../core/usecases';
import { ILesson, IVocabulary } from '../../core/models';

/**
 * Custom hook quản lý trạng thái khi gọi API tạo từ vựng
 */
export const useGenerateVocab = (initialLesson?: ILesson | null) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [newVocab, setNewVocab] = useState('');
  const [vocabData, setVocabData] = useState<IVocabulary | null>(null);
    const [vocabularies, setVocabularies] = useState<IVocabulary[]>(
      initialLesson?.vocabularies ?? []
    );
  /**
   * Hàm trigger quá trình tạo từ vựng
   * @param {string} word - Từ vựng cần tạo
   */
  const generate = async (word: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Gọi UseCase để thực thi logic
      const result = await executeGenerateVocab(word);
        // result is IVocabulary
        setVocabData(result);
        setVocabularies((prev) => [...prev, { ...result, id: `vocab-${Date.now()}` }]);
        setNewVocab('');
    } catch (err: unknown) {
      setError((err as Error).message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return { generate, isLoading, error, vocabData, setVocabularies, vocabularies, newVocab, setNewVocab };
};