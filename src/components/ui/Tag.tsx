import React from 'react';
import { cn } from '../../lib/utils';

interface TagProps {
  children: React.ReactNode;
  variant?: 'default' | 'life' | 'engineering' | 'muted';
  className?: string;
}

const variantStyles = {
  default: 'bg-surface2/60 text-muted border-border/40',
  life: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/25 dark:border-purple-500/15',
  engineering: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/25 dark:border-cyan-500/15',
  muted: 'bg-transparent text-muted border-border/30',
};

export const Tag = ({ children, variant = 'default', className }: TagProps) => {
  return (
    <span className={cn(
      "px-2 py-1 text-[10px] uppercase tracking-wider font-semibold rounded-md border",
      variantStyles[variant],
      className
    )}>
      {children}
    </span>
  );
};
