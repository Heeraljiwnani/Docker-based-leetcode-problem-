import { useState, useEffect, useCallback } from 'react';
import api from '../lib/axios';
import { StreakData } from '../types/problem';

const getMockActiveDays = (): string[] => {
  const dates: string[] = [];
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const activeDayNumbers = [1, 3, 5, 8, 12, 14, 15, 18, 20, today.getDate()];

  for (const day of activeDayNumbers) {
    if (day <= today.getDate()) {
      const d = new Date(year, month, day);
      dates.push(d.toISOString().split('T')[0]);
    }
  }

  return dates;
};

const MOCK_STREAK: StreakData = {
  currentStreak: 7,
  longestStreak: 21,
  activeDays: getMockActiveDays(),
};

export const useStreak = () => {
  const [data, setData] = useState<StreakData>(MOCK_STREAK);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const fetchStreak = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await api.get('/streak');
      if (response.data && typeof response.data === 'object' && typeof response.data.currentStreak === 'number') {
        setData(response.data);
      } else {
        setData(MOCK_STREAK);
      }
    } catch {
      setData(MOCK_STREAK);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStreak();
  }, [fetchStreak]);

  return { data, isLoading, isError, refetch: fetchStreak };
};
