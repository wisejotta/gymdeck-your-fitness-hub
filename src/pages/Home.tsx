import { useAppStore } from '@/stores/appStore';
import { DeckCard } from '@/components/deck/DeckCard';
import { XPBadge } from '@/components/stats/XPBadge';
import { WeeklyActivity } from '@/components/stats/WeeklyActivity';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PlusCircle, Flame, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const { user, decks, sessions } = useAppStore();

  const recentDecks = decks.slice(0, 2);
  const totalWorkouts = sessions.length;
  
  // Calculate streak (consecutive days)
  const calculateStreak = () => {
    if (sessions.length === 0) return 0;
    
    const today = new Date();
    let streak = 0;
    let checkDate = new Date(today);
    
    for (let i = 0; i < 30; i++) {
      const dayStart = new Date(checkDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(checkDate);
      dayEnd.setHours(23, 59, 59, 999);
      
      const hasWorkout = sessions.some((s) => {
        const date = new Date(s.timestamp);
        return date >= dayStart && date <= dayEnd;
      });
      
      if (hasWorkout) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (i === 0) {
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  const streak = calculateStreak();

  return (
    <div className="min-h-screen pb-24">
      <div className="px-5 pt-8 pb-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-muted-foreground text-sm mb-1">Welcome back,</p>
            <h1 className="font-display text-4xl text-foreground">
              {user?.username || 'Athlete'}
            </h1>
          </div>
          <XPBadge xp={user?.totalXP || 0} size="lg" />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="p-4 gradient-card border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg gradient-accent">
                <Flame className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-display text-foreground">{streak}</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 gradient-card border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg gradient-primary">
                <Target className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-display text-foreground">{totalWorkouts}</p>
                <p className="text-xs text-muted-foreground">Workouts</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Weekly Activity */}
        <div className="mb-8">
          <WeeklyActivity />
        </div>

        {/* Recent Decks */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl text-foreground">Recent Decks</h2>
            <Link to="/decks">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                View All
              </Button>
            </Link>
          </div>

          {recentDecks.length > 0 ? (
            <div className="space-y-3">
              {recentDecks.map((deck) => (
                <DeckCard key={deck.id} deck={deck} />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center gradient-card border-border/50">
              <p className="text-muted-foreground mb-4">No decks yet. Create your first workout!</p>
              <Link to="/create">
                <Button className="gradient-primary text-primary-foreground">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Create Deck
                </Button>
              </Link>
            </Card>
          )}
        </div>

        {/* Quick Actions */}
        <Link to="/create" className="block">
          <Card className="p-5 gradient-card border-border/50 hover:border-primary/30 transition-all cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl gradient-primary group-hover:shadow-glow transition-shadow">
                <PlusCircle className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display text-xl text-foreground">Create New Deck</h3>
                <p className="text-sm text-muted-foreground">Build your custom workout routine</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
