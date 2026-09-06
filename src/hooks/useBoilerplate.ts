import { useState, useEffect, useCallback } from 'react';
import api from '../lib/axios';
import { getProblemById } from '../data/problemsData';

const DEFAULT_BOILERPLATES: Record<string, string> = {
  ts: `function twoSum(nums: number[], target: number): number[] {
    const numMap = new Map<number, number>();

    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (numMap.has(complement)) {
            return [numMap.get(complement)!, i];
        }
        numMap.set(nums[i], i);
    }

    return [];
}
`,
  js: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
    const numMap = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (numMap.has(complement)) {
            return [numMap.get(complement), i];
        }
        numMap.set(nums[i], i);
    }
    return [];
}
`,
  py: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        num_map = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in num_map:
                return [num_map[complement], i]
            num_map[num] = i
        return []
`,
  cpp: `#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> numMap;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (numMap.find(complement) != numMap.end()) {
                return {numMap[complement], i};
            }
            numMap[nums[i]] = i;
        }
        return {};
    }
};
`,
  java: `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> numMap = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (numMap.containsKey(complement)) {
                return new int[] { numMap.get(complement), i };
            }
            numMap.put(nums[i], i);
        }
        return new int[] {};
    }
}
`,
  cs: `using System.Collections.Generic;

public class Solution {
    public int[] TwoSum(int[] nums, int target) {
        var numMap = new Dictionary<int, int>();
        for (int i = 0; i < nums.Length; i++) {
            int complement = target - nums[i];
            if (numMap.ContainsKey(complement)) {
                return new int[] { numMap[complement], i };
            }
            numMap[nums[i]] = i;
        }
        return new int[0];
    }
}
`,
  go: `package main

func twoSum(nums []int, target int) []int {
    numMap := make(map[int]int)
    for i, num := range nums {
        complement := target - num
        if idx, ok := numMap[complement]; ok {
            return []int{idx, i}
        }
        numMap[num] = i
    }
    return nil
}
`,
  rust: `use std::collections::HashMap;

impl Solution {
    pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
        let mut map = HashMap::new();
        for (i, &num) in nums.iter().enumerate() {
            let complement = target - num;
            if let Some(&prev) = map.get(&complement) {
                return vec![prev as i32, i as i32];
            }
            map.insert(num, i);
        }
        vec![]
    }
}
`,
};

export const normalizeLangKey = (lang: string): string => {
  const l = lang.toLowerCase();
  if (['ts', 'typescript'].includes(l)) return 'ts';
  if (['js', 'javascript'].includes(l)) return 'js';
  if (['py', 'py3', 'python'].includes(l)) return 'py';
  if (['cpp', 'c', 'c++'].includes(l)) return 'cpp';
  if (['java'].includes(l)) return 'java';
  if (['cs', 'csharp', 'c#'].includes(l)) return 'cs';
  if (['go', 'golang'].includes(l)) return 'go';
  if (['rust', 'rs'].includes(l)) return 'rust';
  return l;
};

export const useBoilerplate = (problemId?: string, language: string = 'cpp') => {
  const [boilerplate, setBoilerplate] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getProblemBoilerplate = useCallback((pId: string, lang: string): string => {
    const normalized = normalizeLangKey(lang);
    const problem = getProblemById(pId);
    if (problem && problem.boilerplates) {
      if (normalized === 'cpp' && problem.boilerplates.cpp) return problem.boilerplates.cpp;
      if (normalized === 'py' && problem.boilerplates.python) return problem.boilerplates.python;
      if (normalized === 'java' && problem.boilerplates.java) return problem.boilerplates.java;
      if (normalized === 'ts' && problem.boilerplates.typescript) return problem.boilerplates.typescript;
      if (normalized === 'js' && problem.boilerplates.javascript) return problem.boilerplates.javascript;
    }
    return DEFAULT_BOILERPLATES[normalized] || DEFAULT_BOILERPLATES.cpp;
  }, []);

  const fetchBoilerplate = useCallback(async () => {
    if (!problemId) return;
    setIsLoading(true);
    const normalized = normalizeLangKey(language);
    try {
      const response = await api.get(`/problems/${problemId}/boilerplate`, {
        params: { language: normalized },
      });
      if (typeof response.data?.code === 'string') {
        setBoilerplate(response.data.code);
      } else {
        setBoilerplate(getProblemBoilerplate(problemId, language));
      }
    } catch {
      setBoilerplate(getProblemBoilerplate(problemId, language));
    } finally {
      setIsLoading(false);
    }
  }, [problemId, language, getProblemBoilerplate]);

  useEffect(() => {
    fetchBoilerplate();
  }, [fetchBoilerplate]);

  return { boilerplate, isLoading, refetch: fetchBoilerplate };
};
