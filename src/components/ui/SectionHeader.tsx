import React from 'react';
import { HandwrittenNote } from './HandwrittenNote';
import { cn } from '../../lib/utils';

interface SectionHeaderProps {
  label?: string;
  title: string;
  annotation?: string;
  description?: string;
  className?: string;
}

export const SectionHeader = ({ label, title, annotation, description, className }: SectionHeaderProps) => {
  return (
    <div className={cn("mb-10 md:mb-14", className)}>
      <div className="flex items-start gap-4 mb-4">
        <div>
          {label && (
            <span className="label-mono mb-3 inline-flex items-center gap-2 rounded-full border border-border/50 bg-surface-2/40 px-3 py-1 !text-[11px] !tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-green" />
              {label}
            </span>
          )}
          <h2 className="display-serif text-3xl md:text-4xl lg:text-5xl text-text">{title}</h2>
        </div>
        {annotation && (
          <HandwrittenNote className="hidden md:block mt-3">{annotation}</HandwrittenNote>
        )}
      </div>
      {description && (
        <p className="text-muted leading-relaxed max-w-2xl text-lg">{description}</p>
      )}
    </div>
  );
};
