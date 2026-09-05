import { useState, useEffect, useCallback } from 'react';
import api from '../lib/axios';
import { UserProgress } from '../types/problem';

const MOCK_PROGRESS: UserProgress = {
  solvedCount: 126,
  totalCount: 3120,
  easySolved: 74,
  easyTotal: 820,
  mediumSolved: 42,
  mediumTotal: 1640,
  hardSolved: 10,
  hardTotal: 660,
};

export const useProgress = () => {
  const [data, setData] = useState<UserProgress>(MOCK_PROGRESS);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const fetchProgress = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await api.get('/progress');
      if (response.data && typeof response.data === 'object' && typeof response.data.solvedCount === 'number') {
        setData(response.data);
      } else {
        setData(MOCK_PROGRESS);
      }
    } catch {
      setData(MOCK_PROGRESS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return { data, isLoading, isError, refetch: fetchProgress };
};
