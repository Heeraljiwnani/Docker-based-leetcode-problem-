import { useState, useEffect, useCallback } from 'react';
import api from '../lib/axios';
import { LanguageStat } from '../types/profile';

const MOCK_LANGUAGE_STATS: LanguageStat[] = [
  { language: 'Python 3', solvedCount: 68 },
  { language: 'C++', solvedCount: 32 },
  { language: 'Java', solvedCount: 18 },
  { language: 'JavaScript', solvedCount: 8 },
];

export const useLanguageStats = () => {
  const [data, setData] = useState<LanguageStat[]>(MOCK_LANGUAGE_STATS);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const fetchLanguageStats = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await api.get('/profile/languages');
      if (Array.isArray(response.data)) {
        setData(response.data);
      } else {
        setData(MOCK_LANGUAGE_STATS);
      }
    } catch {
      setData(MOCK_LANGUAGE_STATS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLanguageStats();
  }, [fetchLanguageStats]);

  return { data, isLoading, isError, refetch: fetchLanguageStats };
};
