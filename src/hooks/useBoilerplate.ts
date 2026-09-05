import { useState, useEffect, useCallback } from 'react';
import api from '../lib/axios';

const DEFAULT_BOILERPLATES: Record<string, string> = {
  python: `class Solution:
    def solve(self, nums: list[int], target: int) -> list[int]:
        # Write your code here
        pass
`,
  cpp: `#include <iostream>
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> solve(vector<int>& nums, int target) {
        // Write your code here
        return {};
    }
};
`,
  java: `import java.util.*;

class Solution {
    public int[] solve(int[] nums, int target) {
        // Write your code here
        return new int[]{};
    }
}
`,
  javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function solve(nums, target) {
  // Write your code here
  return [];
}
`,
};

export const useBoilerplate = (problemId?: string, language: string = 'python') => {
  const [boilerplate, setBoilerplate] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchBoilerplate = useCallback(async () => {
    if (!problemId) return;
    setIsLoading(true);
    try {
      const response = await api.get(`/problems/${problemId}/boilerplate`, {
        params: { language },
      });
      if (typeof response.data?.code === 'string') {
        setBoilerplate(response.data.code);
      } else {
        setBoilerplate(DEFAULT_BOILERPLATES[language] || DEFAULT_BOILERPLATES.python);
      }
    } catch {
      setBoilerplate(DEFAULT_BOILERPLATES[language] || DEFAULT_BOILERPLATES.python);
    } finally {
      setIsLoading(false);
    }
  }, [problemId, language]);

  useEffect(() => {
    fetchBoilerplate();
  }, [fetchBoilerplate]);

  return { boilerplate, isLoading, refetch: fetchBoilerplate };
};
