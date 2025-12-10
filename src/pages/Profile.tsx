import { useAppStore } from '@/stores/appStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { XPBadge } from '@/components/stats/XPBadge';
import { Settings, Edit2, LogOut, Flame, Target, Calendar, Trophy } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function Profile() {
  const navigate = useNavigate();
  const { user, setUser, sessions } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');

  const handleSave = () => {
    if (!username.trim()) {
      toast.error('Username cannot be empty');
      return;
    }
    if (user) {
      setUser({ ...user, username: username.trim() });
      toast.success('Profile updated!');
    }
    setIsEditing(false);
  };

  // Calculate stats
  const totalWorkouts = sessions.length;
  const totalMinutes = Math.floor(sessions.reduce((sum, s) => sum + s.totalDuration, 0) / 60);
  const avgRating = sessions.length > 0 
    ? (sessions.reduce((sum, s) => sum + s.rating, 0) / sessions.length).toFixed(1)
    : '0';

  const getInitials = (name: string) => name.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen pb-24">
      <div className="px-5 pt-8 pb-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-4xl text-foreground">Profile</h1>
          <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={() => navigate('/settings')}>
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        {/* Profile Card */}
        <Card className="p-6 gradient-card border-border/50 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center">
              <span className="font-display text-3xl text-primary-foreground">
                {getInitials(user?.username || 'AT')}
              </span>
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="flex gap-2">
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-secondary border-border"
                    autoFocus
                  />
                  <Button size="sm" onClick={handleSave} className="gradient-primary text-primary-foreground">
                    Save
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-2xl text-foreground">
                    {user?.username || 'Athlete'}
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
              <XPBadge xp={user?.totalXP || 0} size="md" className="mt-2" />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">Workouts</span>
              </div>
              <p className="font-display text-2xl text-foreground">{totalWorkouts}</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-accent" />
                <span className="text-xs text-muted-foreground">Minutes</span>
              </div>
              <p className="font-display text-2xl text-foreground">{totalMinutes}</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-xs text-muted-foreground">Avg Rating</span>
              </div>
              <p className="font-display text-2xl text-foreground">{avgRating}</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-2 mb-1">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-xs text-muted-foreground">Total XP</span>
              </div>
              <p className="font-display text-2xl text-foreground">{user?.totalXP || 0}</p>
            </div>
          </div>
        </Card>

        {/* Recent Sessions */}
        <div className="mb-6">
          <h3 className="font-display text-xl text-foreground mb-4">Recent Sessions</h3>
          {sessions.length > 0 ? (
            <div className="space-y-2">
              {sessions.slice(-5).reverse().map((session) => (
                <Card key={session.sessionId} className="p-4 gradient-card border-border/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        {session.completedCards} exercises completed
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(session.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-accent font-semibold">
                        {Math.floor(session.totalDuration / 60)}m
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {'⭐'.repeat(session.rating)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center gradient-card border-border/50">
              <p className="text-muted-foreground">No workout sessions yet</p>
            </Card>
          )}
        </div>

        {/* Actions */}
        <Button
          variant="outline"
          className="w-full border-destructive/30 text-destructive hover:bg-destructive/10"
          onClick={async () => {
            await supabase.auth.signOut();
            toast.success('Signed out');
            navigate('/auth');
          }}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
