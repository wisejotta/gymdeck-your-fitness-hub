import { Card } from '@/components/ui/card';
import { useAppStore } from '@/stores/appStore';
import { Trophy, Medal, Award, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock friends data for demo
const mockFriends = [
  { id: '1', username: 'FitnessPro', totalXP: 2450, totalWorkouts: 28, avatarUrl: null },
  { id: '2', username: 'GymWarrior', totalXP: 1890, totalWorkouts: 22, avatarUrl: null },
  { id: '3', username: 'IronWill', totalXP: 1650, totalWorkouts: 19, avatarUrl: null },
];

export default function Leaderboard() {
  const { user, sessions } = useAppStore();

  const allUsers = [
    ...(user ? [{ ...user, isCurrentUser: true }] : []),
    ...mockFriends.map((f) => ({ ...f, isCurrentUser: false })),
  ].sort((a, b) => b.totalXP - a.totalXP);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-muted-foreground font-bold">{index + 1}</span>;
    }
  };

  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="px-5 pt-8 pb-6">
        <h1 className="font-display text-4xl text-foreground mb-2">Leaderboard</h1>
        <p className="text-muted-foreground mb-8">Compete with friends</p>

        {/* Top 3 Podium */}
        <div className="flex items-end justify-center gap-2 mb-8 h-48">
          {/* 2nd Place */}
          {allUsers[1] && (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-2 border-2 border-gray-400">
                <span className="font-display text-xl text-foreground">
                  {getInitials(allUsers[1].username)}
                </span>
              </div>
              <p className="text-sm font-medium text-foreground truncate max-w-[80px]">
                {allUsers[1].username}
              </p>
              <p className="text-xs text-muted-foreground">{allUsers[1].totalXP} XP</p>
              <div className="w-20 h-20 gradient-card rounded-t-lg mt-2 flex items-center justify-center border-t border-x border-gray-400/30">
                <span className="font-display text-3xl text-gray-400">2</span>
              </div>
            </div>
          )}

          {/* 1st Place */}
          {allUsers[0] && (
            <div className="flex flex-col items-center -mt-8">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-2 border-2 border-yellow-500 shadow-glow">
                  <span className="font-display text-2xl text-foreground">
                    {getInitials(allUsers[0].username)}
                  </span>
                </div>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
              <p className="text-sm font-medium text-foreground truncate max-w-[100px]">
                {allUsers[0].username}
                {(allUsers[0] as any).isCurrentUser && ' (You)'}
              </p>
              <p className="text-xs text-accent font-semibold">{allUsers[0].totalXP} XP</p>
              <div className="w-24 h-28 gradient-primary rounded-t-lg mt-2 flex items-center justify-center">
                <span className="font-display text-4xl text-primary-foreground">1</span>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {allUsers[2] && (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-2 border-2 border-amber-600">
                <span className="font-display text-xl text-foreground">
                  {getInitials(allUsers[2].username)}
                </span>
              </div>
              <p className="text-sm font-medium text-foreground truncate max-w-[80px]">
                {allUsers[2].username}
              </p>
              <p className="text-xs text-muted-foreground">{allUsers[2].totalXP} XP</p>
              <div className="w-20 h-16 gradient-card rounded-t-lg mt-2 flex items-center justify-center border-t border-x border-amber-600/30">
                <span className="font-display text-3xl text-amber-600">3</span>
              </div>
            </div>
          )}
        </div>

        {/* Full Rankings */}
        <Card className="gradient-card border-border/50 overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-2">
            <Users className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-display text-xl text-foreground">All Rankings</h3>
          </div>
          <div className="divide-y divide-border">
            {allUsers.map((person, index) => (
              <div
                key={person.id}
                className={cn(
                  'flex items-center gap-4 p-4 transition-colors',
                  (person as any).isCurrentUser && 'bg-primary/5'
                )}
              >
                <div className="w-8 flex justify-center">
                  {getRankIcon(index)}
                </div>
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <span className="font-medium text-foreground text-sm">
                    {getInitials(person.username)}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    {person.username}
                    {(person as any).isCurrentUser && (
                      <span className="text-primary ml-2 text-sm">(You)</span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {person.totalWorkouts} workouts
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-lg text-accent">{person.totalXP}</p>
                  <p className="text-xs text-muted-foreground">XP</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
