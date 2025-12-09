import { ExerciseCard } from '@/types';

export const exerciseLibrary: ExerciseCard[] = [
  { id: '1', name: 'Push-ups', description: 'Classic chest and tricep exercise', duration: 30, type: 'time' },
  { id: '2', name: 'Squats', description: 'Lower body strength builder', duration: 30, type: 'time' },
  { id: '3', name: 'Plank', description: 'Core stability hold', duration: 45, type: 'time' },
  { id: '4', name: 'Burpees', description: 'Full body cardio blast', duration: 20, type: 'reps' },
  { id: '5', name: 'Lunges', description: 'Leg and glute workout', duration: 20, type: 'reps' },
  { id: '6', name: 'Mountain Climbers', description: 'Cardio and core combo', duration: 30, type: 'time' },
  { id: '7', name: 'Jumping Jacks', description: 'Full body warm-up', duration: 30, type: 'time' },
  { id: '8', name: 'High Knees', description: 'Cardio intensity', duration: 30, type: 'time' },
  { id: '9', name: 'Tricep Dips', description: 'Arm strengthening', duration: 15, type: 'reps' },
  { id: '10', name: 'Bicycle Crunches', description: 'Oblique targeting', duration: 20, type: 'reps' },
  { id: '11', name: 'Wall Sit', description: 'Leg endurance hold', duration: 45, type: 'time' },
  { id: '12', name: 'Superman Hold', description: 'Lower back strengthening', duration: 30, type: 'time' },
];

export const sampleDecks = [
  {
    id: 'deck-1',
    title: 'Morning Burn',
    description: 'Quick 10-min full body wake-up routine',
    createdBy: 'system',
    exercises: [exerciseLibrary[0], exerciseLibrary[1], exerciseLibrary[6], exerciseLibrary[2]],
    totalDuration: 135,
    xpValue: 100,
    createdAt: new Date(),
  },
  {
    id: 'deck-2',
    title: 'Core Crusher',
    description: 'Intense ab workout for steel core',
    createdBy: 'system',
    exercises: [exerciseLibrary[2], exerciseLibrary[9], exerciseLibrary[5], exerciseLibrary[11]],
    totalDuration: 125,
    xpValue: 120,
    createdAt: new Date(),
  },
  {
    id: 'deck-3',
    title: 'Leg Day',
    description: 'Build powerful lower body strength',
    createdBy: 'system',
    exercises: [exerciseLibrary[1], exerciseLibrary[4], exerciseLibrary[10], exerciseLibrary[7]],
    totalDuration: 125,
    xpValue: 110,
    createdAt: new Date(),
  },
];
