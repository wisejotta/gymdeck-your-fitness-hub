import { Deck } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Clock, Zap, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppStore } from '@/stores/appStore';

interface DeckCardProps {
  deck: Deck;
  showActions?: boolean;
}

export function DeckCard({ deck, showActions = true }: DeckCardProps) {
  const navigate = useNavigate();
  const { deleteDeck, startSession } = useAppStore();

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const handleStart = () => {
    startSession(deck);
    navigate(`/workout/${deck.id}`);
  };

  const handleEdit = () => {
    navigate(`/create?edit=${deck.id}`);
  };

  const handleDelete = () => {
    deleteDeck(deck.id);
  };

  return (
    <Card className="group relative overflow-hidden gradient-card border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-glow">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-display text-2xl text-foreground tracking-wide">
              {deck.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {deck.description}
            </p>
          </div>
          {showActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{formatDuration(deck.totalDuration)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-accent font-semibold">{deck.xpValue} XP</span>
          </div>
          <span className="text-xs">
            {deck.exercises.length} exercises
          </span>
        </div>

        <Button
          onClick={handleStart}
          className="w-full gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
        >
          <Play className="w-4 h-4 mr-2" />
          Start Workout
        </Button>
      </div>

      <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/20 rounded-lg transition-colors pointer-events-none" />
    </Card>
  );
}
