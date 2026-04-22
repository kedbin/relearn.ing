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
            <span className="label-mono block mb-2">{label}</span>
          )}
          <h2 className="display-serif text-3xl md:text-4xl text-text">{title}</h2>
        </div>
        {annotation && (
          <HandwrittenNote className="hidden md:block mt-1">{annotation}</HandwrittenNote>
        )}
      </div>
      {description && (
        <p className="text-muted leading-relaxed max-w-2xl">{description}</p>
      )}
    </div>
  );
};
