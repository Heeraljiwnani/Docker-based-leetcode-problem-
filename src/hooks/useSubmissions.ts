import { useState, useEffect, useCallback } from 'react';
import api from '../lib/axios';
import { RecentSubmissionItem } from '../types/profile';

const MOCK_RECENT_SUBMISSIONS: RecentSubmissionItem[] = [
  {
    id: 'sub_101',
    problemId: '1',
    problemTitle: 'Two Sum',
    status: 'Accepted',
    language: 'Python 3',
    timestamp: '2 hours ago',
  },
  {
    id: 'sub_102',
    problemId: '5',
    problemTitle: 'Longest Palindromic Substring',
    status: 'Accepted',
    language: 'C++',
    timestamp: '5 hours ago',
  },
  {
    id: 'sub_103',
    problemId: '3',
    problemTitle: 'Longest Substring Without Repeating Characters',
    status: 'Wrong Answer',
    language: 'Python 3',
    timestamp: '1 day ago',
  },
  {
    id: 'sub_104',
    problemId: '11',
    problemTitle: 'Container With Most Water',
    status: 'Accepted',
    language: 'Java',
    timestamp: '2 days ago',
  },
  {
    id: 'sub_105',
    problemId: '16',
    problemTitle: 'Trapping Rain Water',
    status: 'Accepted',
    language: 'Python 3',
    timestamp: '3 days ago',
  },
  {
    id: 'sub_106',
    problemId: '4',
    problemTitle: 'Median of Two Sorted Arrays',
    status: 'Time Limit Exceeded',
    language: 'C++',
    timestamp: '4 days ago',
  },
  {
    id: 'sub_107',
    problemId: '9',
    problemTitle: 'Palindrome Number',
    status: 'Accepted',
    language: 'JavaScript',
    timestamp: '5 days ago',
  },
  {
    id: 'sub_108',
    problemId: '13',
    problemTitle: 'Roman to Integer',
    status: 'Accepted',
    language: 'Python 3',
    timestamp: '1 week ago',
  },
];

export const useSubmissions = (filterAcceptedOnly: boolean = false) => {
  const [data, setData] = useState<RecentSubmissionItem[]>(MOCK_RECENT_SUBMISSIONS);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const fetchSubmissions = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await api.get('/submissions');
      if (Array.isArray(response.data)) {
        setData(response.data);
      } else {
        setData(MOCK_RECENT_SUBMISSIONS);
      }
    } catch {
      setData(MOCK_RECENT_SUBMISSIONS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const filteredData = filterAcceptedOnly
    ? data.filter((item) => item.status === 'Accepted')
    : data;

  return { data: filteredData, isLoading, isError, refetch: fetchSubmissions };
};
