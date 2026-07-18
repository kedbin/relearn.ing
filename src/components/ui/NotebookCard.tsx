import React from 'react';
import { cn } from '../../lib/utils';

interface NotebookCardProps {
  title?: string;
  label?: string;
  children: React.ReactNode;
  className?: string;
}

export const NotebookCard = ({ title, label, children, className }: NotebookCardProps) => {
  return (
    <section className={cn(
      "notebook-card",
      className
    )}>
      {label && (
        <span className="label-mono block mb-3">{label}</span>
      )}
      {title && <h3 className="display-serif mb-4 text-2xl text-text">{title}</h3>}
      {children}
    </section>
  );
};
