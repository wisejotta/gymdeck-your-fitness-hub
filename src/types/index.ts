export interface ExerciseCard {
  id: string;
  name: string;
  description: string;
  duration: number;
  imageUrl?: string;
  type: 'time' | 'reps';
}

export interface Deck {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  exercises: ExerciseCard[];
  totalDuration: number;
  xpValue: number;
  createdAt: Date;
}

export interface WorkoutSession {
  sessionId: string;
  deckId: string;
  userId: string;
  completedCards: number;
  skippedCards: number;
  totalDuration: number;
  rating: number;
  timestamp: Date;
}

export interface UserProfile {
  id: string;
  username: string;
  avatarUrl?: string;
  totalXP: number;
  totalWorkouts: number;
  weeklyLog: Record<string, WorkoutSession[]>;
  friends: string[];
}
