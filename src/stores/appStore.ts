import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Deck, WorkoutSession, UserProfile, ExerciseCard } from '@/types';
import { sampleDecks } from '@/data/exercises';

interface AppState {
  user: UserProfile | null;
  decks: Deck[];
  sessions: WorkoutSession[];
  currentSession: {
    deck: Deck | null;
    currentCardIndex: number;
    completedCards: number;
    skippedCards: number;
    startTime: Date | null;
  } | null;
  
  // Actions
  setUser: (user: UserProfile | null) => void;
  addDeck: (deck: Deck) => void;
  updateDeck: (id: string, deck: Partial<Deck>) => void;
  deleteDeck: (id: string) => void;
  startSession: (deck: Deck) => void;
  nextCard: (skipped?: boolean) => void;
  endSession: (rating: number) => WorkoutSession | null;
  addXP: (amount: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: {
        id: 'user-1',
        username: 'Athlete',
        totalXP: 0,
        totalWorkouts: 0,
        weeklyLog: {},
        friends: [],
      },
      decks: sampleDecks,
      sessions: [],
      currentSession: null,

      setUser: (user) => set({ user }),

      addDeck: (deck) => set((state) => ({ decks: [...state.decks, deck] })),

      updateDeck: (id, updates) =>
        set((state) => ({
          decks: state.decks.map((d) => (d.id === id ? { ...d, ...updates } : d)),
        })),

      deleteDeck: (id) =>
        set((state) => ({
          decks: state.decks.filter((d) => d.id !== id),
        })),

      startSession: (deck) =>
        set({
          currentSession: {
            deck,
            currentCardIndex: 0,
            completedCards: 0,
            skippedCards: 0,
            startTime: new Date(),
          },
        }),

      nextCard: (skipped = false) =>
        set((state) => {
          if (!state.currentSession) return state;
          return {
            currentSession: {
              ...state.currentSession,
              currentCardIndex: state.currentSession.currentCardIndex + 1,
              completedCards: skipped
                ? state.currentSession.completedCards
                : state.currentSession.completedCards + 1,
              skippedCards: skipped
                ? state.currentSession.skippedCards + 1
                : state.currentSession.skippedCards,
            },
          };
        }),

      endSession: (rating) => {
        const state = get();
        if (!state.currentSession?.deck || !state.currentSession.startTime) return null;

        const session: WorkoutSession = {
          sessionId: `session-${Date.now()}`,
          deckId: state.currentSession.deck.id,
          userId: state.user?.id || 'anonymous',
          completedCards: state.currentSession.completedCards,
          skippedCards: state.currentSession.skippedCards,
          totalDuration: Math.floor(
            (Date.now() - state.currentSession.startTime.getTime()) / 1000
          ),
          rating,
          timestamp: new Date(),
        };

        const xpEarned = Math.floor(
          (state.currentSession.completedCards /
            state.currentSession.deck.exercises.length) *
            state.currentSession.deck.xpValue
        );

        set((state) => ({
          sessions: [...state.sessions, session],
          currentSession: null,
          user: state.user
            ? {
                ...state.user,
                totalXP: state.user.totalXP + xpEarned,
                totalWorkouts: state.user.totalWorkouts + 1,
              }
            : null,
        }));

        return session;
      },

      addXP: (amount) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, totalXP: state.user.totalXP + amount }
            : null,
        })),
    }),
    {
      name: 'gymdeck-storage',
    }
  )
);
