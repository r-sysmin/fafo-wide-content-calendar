import { Badge as ShadcnBadge, type BadgeProps as ShadcnBadgeProps } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type BadgeColor = 'gray' | 'blue' | 'amber' | 'red' | 'green' | 'purple' | 'orange';

const colorStyles: Record<BadgeColor, string> = {
  gray: 'bg-gray-100 text-gray-700 border-transparent',
  blue: 'bg-blue-50 text-blue-700 border-transparent',
  amber: 'bg-amber-50 text-amber-700 border-transparent',
  red: 'bg-red-50 text-red-700 border-transparent',
  green: 'bg-green-50 text-green-700 border-transparent',
  purple: 'bg-purple-50 text-purple-700 border-transparent',
  orange: 'bg-orange-50 text-orange-700 border-transparent',
};

interface BadgeProps extends Omit<ShadcnBadgeProps, 'variant'> {
  color?: BadgeColor;
}

function Badge({ color = 'gray', className, ...props }: BadgeProps) {
  return (
    <ShadcnBadge
      variant="outline"
      className={cn(colorStyles[color], className)}
      {...props}
    />
  );
}

export { Badge, type BadgeColor, type BadgeProps };
