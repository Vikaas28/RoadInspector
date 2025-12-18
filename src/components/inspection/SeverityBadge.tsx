import { cn } from '@/lib/utils';
import { SeverityLevel } from '@/types/inspection';

interface SeverityBadgeProps {
  severity: SeverityLevel;
  size?: 'sm' | 'md' | 'lg';
}

const severityColors: Record<SeverityLevel, string> = {
  low: 'bg-severity-low text-white',
  medium: 'bg-severity-medium text-foreground',
  high: 'bg-severity-high text-white',
  critical: 'bg-severity-critical text-white',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-sm font-medium',
};

export function SeverityBadge({ severity, size = 'md' }: SeverityBadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center rounded-full font-medium capitalize',
      severityColors[severity],
      sizeClasses[size]
    )}>
      {severity}
    </span>
  );
}
