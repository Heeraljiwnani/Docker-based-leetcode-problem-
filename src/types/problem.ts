export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Problem {
  id: string;
  title: string;
  difficulty: Difficulty;
  solved: boolean;
  acceptanceRate?: number;
  tags?: string[];
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
