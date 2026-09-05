export interface LanguageStat {
  language: string;
  solvedCount: number;
  icon?: string;
}

export interface SubmissionStats {
  totalSubmissions: number;
  activeDaysCount: number;
  maxStreak: number;
  dailyCounts: Record<string, number>; // YYYY-MM-DD -> count map
}

export interface RecentSubmissionItem {
  id: string;
  problemId: string;
  problemTitle: string;
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error' | 'Compilation Error';
  language: string;
  timestamp: string; // ISO date string or relative text
}
