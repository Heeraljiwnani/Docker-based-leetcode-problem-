import { useState, useEffect, useCallback } from 'react';
import api from '../lib/axios';
import { Problem } from '../types/problem';

const MOCK_PROBLEMS: Problem[] = [
  {
    id: '1',
    title: 'Two Sum',
    difficulty: 'Easy',
    solved: true,
    acceptanceRate: 52.4,
    tags: ['Array', 'Hash Table'],
  },
  {
    id: '2',
    title: 'Add Two Numbers',
    difficulty: 'Medium',
    solved: true,
    acceptanceRate: 41.8,
    tags: ['Linked List', 'Math'],
  },
  {
    id: '3',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    solved: false,
    acceptanceRate: 34.5,
    tags: ['Hash Table', 'String', 'Sliding Window'],
  },
  {
    id: '4',
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    solved: false,
    acceptanceRate: 38.2,
    tags: ['Array', 'Binary Search', 'Divide and Conquer'],
  },
  {
    id: '5',
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    solved: true,
    acceptanceRate: 33.7,
    tags: ['String', 'Dynamic Programming'],
  },
  {
    id: '6',
    title: 'Zigzag Conversion',
    difficulty: 'Medium',
    solved: false,
    acceptanceRate: 46.9,
    tags: ['String'],
  },
  {
    id: '7',
    title: 'Reverse Integer',
    difficulty: 'Medium',
    solved: false,
    acceptanceRate: 28.1,
    tags: ['Math'],
  },
  {
    id: '8',
    title: 'String to Integer (atoi)',
    difficulty: 'Medium',
    solved: false,
    acceptanceRate: 17.5,
    tags: ['String'],
  },
  {
    id: '9',
    title: 'Palindrome Number',
    difficulty: 'Easy',
    solved: true,
    acceptanceRate: 55.1,
    tags: ['Math'],
  },
  {
    id: '10',
    title: 'Regular Expression Matching',
    difficulty: 'Hard',
    solved: false,
    acceptanceRate: 28.3,
    tags: ['String', 'Dynamic Programming', 'Recursion'],
  },
  {
    id: '11',
    title: 'Container With Most Water',
    difficulty: 'Medium',
    solved: true,
    acceptanceRate: 54.9,
    tags: ['Array', 'Two Pointers'],
  },
  {
    id: '12',
    title: 'Integer to Roman',
    difficulty: 'Medium',
    solved: false,
    acceptanceRate: 63.8,
    tags: ['Math', 'String'],
  },
  {
    id: '13',
    title: 'Roman to Integer',
    difficulty: 'Easy',
    solved: true,
    acceptanceRate: 60.7,
    tags: ['Math', 'String'],
  },
  {
    id: '14',
    title: 'Longest Common Prefix',
    difficulty: 'Easy',
    solved: true,
    acceptanceRate: 42.6,
    tags: ['String'],
  },
  {
    id: '15',
    title: '3Sum',
    difficulty: 'Medium',
    solved: false,
    acceptanceRate: 33.9,
    tags: ['Array', 'Two Pointers', 'Sorting'],
  },
  {
    id: '16',
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    solved: true,
    acceptanceRate: 61.2,
    tags: ['Array', 'Two Pointers', 'Stack', 'Dynamic Programming'],
  },
];

export const useProblems = () => {
  const [data, setData] = useState<Problem[]>(MOCK_PROBLEMS);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const fetchProblems = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const response = await api.get('/problems');
      if (Array.isArray(response.data)) {
        setData(response.data);
      } else {
        // If Vite SPA returned HTML or non-array, fallback to mock data
        setData(MOCK_PROBLEMS);
      }
    } catch {
      setData(MOCK_PROBLEMS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProblems();
  }, [fetchProblems]);

  return { data, isLoading, isError, refetch: fetchProblems };
};
