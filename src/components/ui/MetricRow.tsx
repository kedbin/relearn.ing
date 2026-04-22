import React from 'react';
import { cn } from '../../lib/utils';

interface MetricRowProps {
  label: string;
  value: string;
  status?: 'healthy' | 'degraded' | 'warning';
  className?: string;
}

export const MetricRow = ({ label, value, status, className }: MetricRowProps) => {
  return (
    <div className={cn("flex items-center justify-between py-2", className)}>
      <span className="text-sm text-muted">{label}</span>
      <div className="flex items-center gap-2">
        {status && (
          <span className={cn("w-1.5 h-1.5 rounded-full",
            status === 'healthy' ? 'bg-green' :
            status === 'degraded' ? 'bg-amber' :
            'bg-redsoft'
          )} />
        )}
        <span className="text-sm text-text font-mono">{value}</span>
      </div>
    </div>
  );
};
