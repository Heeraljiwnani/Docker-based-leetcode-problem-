import { useState, useEffect, useCallback } from 'react';
import api from '../lib/axios';
import { SubmissionStats } from '../types/profile';

const generateMockDailyCounts = (): Record<string, number> => {
  const counts: Record<string, number> = {};
  const today = new Date();

  // Generate 365 days of data
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    // Semi-random submission count (favoring 0-4 submissions with occasional spikes)
    const seed = (i * 37 + 13) % 100;
    if (seed > 45) {
      counts[dateStr] = (seed % 5) + 1;
    } else {
      counts[dateStr] = 0;
    }
  }

  // Ensure today has submissions
  counts[today.toISOString().split('T')[0]] = 3;

  return counts;
};

const mockDailyCounts = generateMockDailyCounts();
const totalSubmissions = Object.values(mockDailyCounts).reduce((a, b) => a + b, 0);
const activeDaysCount = Object.values(mockDailyCounts).filter((c) => c > 0).length;

const MOCK_SUBMISSION_STATS: SubmissionStats = {
  totalSubmissions,
  activeDaysCount,
  maxStreak: 21,
  dailyCounts: mockDailyCounts,
};

export const useSubmissionStats = () => {
  const [data, setData] = useState<SubmissionStats>(MOCK_SUBMISSION_STATS);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await api.get('/profile/stats');
      if (
        response.data &&
        typeof response.data === 'object' &&
        typeof response.data.totalSubmissions === 'number'
      ) {
        setData(response.data);
      } else {
        setData(MOCK_SUBMISSION_STATS);
      }
    } catch {
      setData(MOCK_SUBMISSION_STATS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { data, isLoading, isError, refetch: fetchStats };
};
