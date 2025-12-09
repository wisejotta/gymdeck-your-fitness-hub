import { useAppStore } from '@/stores/appStore';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function WeeklyActivity() {
  const { sessions } = useAppStore();

  const getWeekDays = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    return DAYS.map((day, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      const sessionsOnDay = sessions.filter((s) => {
        const sessionDate = new Date(s.timestamp);
        return sessionDate >= dayStart && sessionDate <= dayEnd;
      });

      const isToday = date.toDateString() === today.toDateString();
      const isPast = date < today && !isToday;

      return {
        day,
        date,
        sessions: sessionsOnDay,
        isToday,
        isPast,
        hasWorkout: sessionsOnDay.length > 0,
      };
    });
  };

  const weekData = getWeekDays();
  const activeDays = weekData.filter((d) => d.hasWorkout).length;

  return (
    <Card className="p-5 gradient-card border-border/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-xl text-foreground">This Week</h3>
        <span className="text-sm text-muted-foreground">
          {activeDays}/7 days active
        </span>
      </div>

      <div className="flex justify-between gap-2">
        {weekData.map(({ day, isToday, hasWorkout, isPast }) => (
          <div key={day} className="flex flex-col items-center gap-2">
            <span
              className={cn(
                'text-xs font-medium',
                isToday ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {day}
            </span>
            <div
              className={cn(
                'w-9 h-9 rounded-lg flex items-center justify-center transition-all',
                hasWorkout
                  ? 'gradient-primary'
                  : isToday
                  ? 'border-2 border-primary bg-primary/10'
                  : isPast
                  ? 'bg-muted/50'
                  : 'bg-secondary'
              )}
            >
              {hasWorkout && (
                <span className="text-primary-foreground text-xs font-bold">✓</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
