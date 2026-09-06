import { useState, useCallback } from 'react';
import { Problem } from '../types/problem';
import { SEED_PROBLEMS } from '../data/problemsData';

export const useProblems = () => {
  const [data] = useState<Problem[]>(SEED_PROBLEMS);
  const [isLoading] = useState(false);
  const [isError] = useState(false);

  const fetchProblems = useCallback(async () => {
    // Exclusively use SEED_PROBLEMS as per prompt requirement
  }, []);

  return { data, isLoading, isError, refetch: fetchProblems };
};

