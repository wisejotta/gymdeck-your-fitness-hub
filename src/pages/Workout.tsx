import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppStore } from '@/stores/appStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { X, SkipForward, Check, Pause, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Workout() {
  const navigate = useNavigate();
  const { deckId } = useParams();
  const { currentSession, decks, startSession, nextCard, endSession } = useAppStore();
  
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showRating, setShowRating] = useState(false);

  // Initialize session if needed
  useEffect(() => {
    if (!currentSession && deckId) {
      const deck = decks.find((d) => d.id === deckId);
      if (deck) {
        startSession(deck);
      }
    }
  }, [currentSession, deckId, decks, startSession]);

  const deck = currentSession?.deck;
  const currentIndex = currentSession?.currentCardIndex || 0;
  const currentExercise = deck?.exercises[currentIndex];
  const isComplete = deck && currentIndex >= deck.exercises.length;

  // Set initial time for current exercise
  useEffect(() => {
    if (currentExercise && currentExercise.type === 'time') {
      setTimeLeft(currentExercise.duration);
    }
  }, [currentExercise]);

  // Timer logic
  useEffect(() => {
    if (!currentExercise || isPaused || currentExercise.type !== 'time' || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentExercise, isPaused, timeLeft]);

  // Auto-advance when timer hits 0
  useEffect(() => {
    if (currentExercise?.type === 'time' && timeLeft === 0 && !isPaused) {
      handleNext(false);
    }
  }, [timeLeft]);

  const handleNext = useCallback((skipped: boolean) => {
    nextCard(skipped);
    setIsPaused(false);
  }, [nextCard]);

  const handleSkip = () => handleNext(true);
  const handleComplete = () => handleNext(false);

  const handleQuit = () => {
    if (window.confirm('Are you sure you want to quit? Your progress will be saved.')) {
      setShowRating(true);
    }
  };

  const handleRate = (rating: number) => {
    endSession(rating);
    navigate('/');
  };

  // Show rating screen when complete
  useEffect(() => {
    if (isComplete) {
      setShowRating(true);
    }
  }, [isComplete]);

  if (!deck) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading workout...</p>
      </div>
    );
  }

  const progress = ((currentIndex) / deck.exercises.length) * 100;

  if (showRating) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5">
        <Card className="w-full max-w-sm p-8 gradient-card border-border/50 text-center">
          <h2 className="font-display text-4xl text-foreground mb-2">
            {isComplete ? 'Workout Complete!' : 'Session Ended'}
          </h2>
          <p className="text-muted-foreground mb-6">
            {currentSession?.completedCards || 0} of {deck.exercises.length} exercises completed
          </p>

          <p className="text-foreground mb-4">How was the difficulty?</p>
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRate(star)}
                className="text-3xl transition-transform hover:scale-110"
              >
                ⭐
              </button>
            ))}
          </div>

          <Button
            variant="ghost"
            onClick={() => handleRate(3)}
            className="text-muted-foreground"
          >
            Skip Rating
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleQuit}
            className="text-muted-foreground"
          >
            <X className="w-5 h-5" />
          </Button>
          <span className="text-sm text-muted-foreground font-medium">
            {currentIndex + 1} / {deck.exercises.length}
          </span>
          <div className="w-10" />
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-5">
        {currentExercise && (
          <>
            <h1 className="font-display text-5xl text-foreground text-center mb-2">
              {currentExercise.name}
            </h1>
            <p className="text-muted-foreground text-center mb-8">
              {currentExercise.description}
            </p>

            {/* Timer or Reps Display */}
            <div className="mb-12">
              {currentExercise.type === 'time' ? (
                <div className="text-center">
                  <div className="relative w-48 h-48 mx-auto mb-4">
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        className="stroke-secondary fill-none"
                        strokeWidth="8"
                      />
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        className="stroke-primary fill-none"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={553}
                        strokeDashoffset={553 * (1 - timeLeft / currentExercise.duration)}
                        style={{ transition: 'stroke-dashoffset 1s linear' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-display text-6xl text-foreground">
                        {timeLeft}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsPaused(!isPaused)}
                    className="border-border"
                  >
                    {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="font-display text-8xl text-gradient-primary mb-2">
                    {currentExercise.duration}
                  </p>
                  <p className="text-xl text-muted-foreground">REPS</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-5 pb-8">
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleSkip}
            className="flex-1 h-14 border-border text-muted-foreground"
          >
            <SkipForward className="w-5 h-5 mr-2" />
            Skip
          </Button>
          <Button
            onClick={handleComplete}
            className="flex-1 h-14 gradient-primary text-primary-foreground font-semibold"
          >
            <Check className="w-5 h-5 mr-2" />
            {currentExercise?.type === 'time' ? 'Done' : 'Complete'}
          </Button>
        </div>
      </div>
    </div>
  );
}
