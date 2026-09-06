export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface TestCase {
  input: string;
  expected_output: string;
  is_hidden?: boolean;
}

export interface Problem {
  id: string; // e.g. "two-sum" or "1"
  numericId?: string; // e.g. "1"
  title: string;
  difficulty: Difficulty;
  solved: boolean;
  acceptanceRate?: number;
  tags?: string[];
  companyTags?: string[];
  statement?: string;
  constraints?: string;
  examples?: string;
  hints?: string;
  editorial?: string;
  boilerplates?: {
    cpp?: string;
    python?: string;
    java?: string;
    typescript?: string;
    javascript?: string;
  };
  testcases?: TestCase[];
}

export interface UserProgress {
  solvedCount: number;
  totalCount: number;
  easySolved: number;
  easyTotal: number;
  mediumSolved: number;
  mediumTotal: number;
  hardSolved: number;
  hardTotal: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  activeDays: string[]; // YYYY-MM-DD format
}
