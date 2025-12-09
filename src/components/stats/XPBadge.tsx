import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface XPBadgeProps {
  xp: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function XPBadge({ xp, size = 'md', className }: XPBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 gradient-xp rounded-full font-semibold text-primary-foreground',
        sizeClasses[size],
        className
      )}
    >
      <Zap className={cn(iconSizes[size], 'fill-current')} />
      <span>{xp.toLocaleString()} XP</span>
    </div>
  );
}
