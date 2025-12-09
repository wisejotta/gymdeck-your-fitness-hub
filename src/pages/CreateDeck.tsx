import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppStore } from '@/stores/appStore';
import { exerciseLibrary } from '@/data/exercises';
import { ExerciseCard } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Plus, X, Clock, Zap, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function CreateDeck() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const { decks, addDeck, updateDeck } = useAppStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<ExerciseCard[]>([]);
  const [showLibrary, setShowLibrary] = useState(false);

  useEffect(() => {
    if (editId) {
      const deck = decks.find((d) => d.id === editId);
      if (deck) {
        setTitle(deck.title);
        setDescription(deck.description);
        setSelectedExercises(deck.exercises);
      }
    }
  }, [editId, decks]);

  const totalDuration = selectedExercises.reduce((sum, ex) => sum + ex.duration, 0);
  const xpValue = selectedExercises.length * 25;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const handleAddExercise = (exercise: ExerciseCard) => {
    setSelectedExercises([...selectedExercises, { ...exercise, id: `${exercise.id}-${Date.now()}` }]);
    setShowLibrary(false);
  };

  const handleRemoveExercise = (index: number) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast.error('Please enter a deck name');
      return;
    }
    if (selectedExercises.length === 0) {
      toast.error('Add at least one exercise');
      return;
    }

    const deckData = {
      id: editId || `deck-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      createdBy: 'user',
      exercises: selectedExercises,
      totalDuration,
      xpValue,
      createdAt: new Date(),
    };

    if (editId) {
      updateDeck(editId, deckData);
      toast.success('Deck updated!');
    } else {
      addDeck(deckData);
      toast.success('Deck created!');
    }

    navigate('/decks');
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="px-5 pt-6 pb-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-muted-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-display text-3xl text-foreground">
            {editId ? 'Edit Deck' : 'Create Deck'}
          </h1>
        </div>

        {/* Form */}
        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Deck Name
            </label>
            <Input
              placeholder="e.g., Morning Burn"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-secondary border-border"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Description
            </label>
            <Textarea
              placeholder="What's this workout about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-secondary border-border resize-none"
              rows={2}
            />
          </div>

          {/* Stats Preview */}
          <Card className="p-4 gradient-card border-border/50">
            <div className="flex items-center justify-around">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {formatDuration(totalDuration)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-accent" />
                <span className="text-sm text-accent font-semibold">{xpValue} XP</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {selectedExercises.length} exercises
              </span>
            </div>
          </Card>

          {/* Exercises */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-foreground">Exercises</label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLibrary(true)}
                className="text-primary border-primary/30"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>

            {selectedExercises.length > 0 ? (
              <div className="space-y-2">
                {selectedExercises.map((exercise, index) => (
                  <Card
                    key={`${exercise.id}-${index}`}
                    className="p-3 gradient-card border-border/50 flex items-center gap-3"
                  >
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">{exercise.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {exercise.duration} {exercise.type === 'time' ? 'sec' : 'reps'}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleRemoveExercise(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center gradient-card border-border/50 border-dashed">
                <p className="text-muted-foreground text-sm">
                  No exercises added yet
                </p>
              </Card>
            )}
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            className="w-full gradient-primary text-primary-foreground font-semibold h-12"
          >
            {editId ? 'Save Changes' : 'Create Deck'}
          </Button>
        </div>
      </div>

      {/* Exercise Library Modal */}
      {showLibrary && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
          <div className="px-5 pt-6 pb-24 h-full overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl text-foreground">Exercise Library</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowLibrary(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid gap-3">
              {exerciseLibrary.map((exercise) => (
                <Card
                  key={exercise.id}
                  className={cn(
                    'p-4 gradient-card border-border/50 cursor-pointer transition-all',
                    'hover:border-primary/30 active:scale-[0.98]'
                  )}
                  onClick={() => handleAddExercise(exercise)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{exercise.name}</p>
                      <p className="text-sm text-muted-foreground">{exercise.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-primary">
                        {exercise.duration} {exercise.type === 'time' ? 'sec' : 'reps'}
                      </p>
                      <Plus className="w-5 h-5 text-primary ml-auto mt-1" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
