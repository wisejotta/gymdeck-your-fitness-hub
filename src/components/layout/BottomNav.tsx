import { Link, useLocation } from 'react-router-dom';
import { Home, Layers, PlusCircle, Trophy, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Layers, label: 'Decks', path: '/decks' },
  { icon: PlusCircle, label: 'Create', path: '/create' },
  { icon: Trophy, label: 'Leaders', path: '/leaderboard' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border">
      <div className="flex items-center justify-around py-2 px-4 max-w-lg mx-auto">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon
                className={cn(
                  'w-6 h-6 transition-transform',
                  isActive && 'scale-110'
                )}
              />
              <span className="text-xs font-medium">{label}</span>
              {isActive && (
                <div className="absolute -bottom-0 w-12 h-1 gradient-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
