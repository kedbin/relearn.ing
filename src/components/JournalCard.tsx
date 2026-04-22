import React from 'react';
import { ArrowRight } from 'lucide-react';
import { NotebookCard } from './ui/NotebookCard';
import { Tag } from './ui/Tag';
import { cn } from '../lib/utils';

interface JournalEntry {
  id: string;
  data: {
    title: string;
    date: string;
    status: string;
    summary: string;
    category: string;
  };
}

interface JournalCardProps {
  entry: JournalEntry;
}

export const JournalCard = ({ entry }: JournalCardProps) => {
  const subCategory = entry.data.category.split('/').pop()?.trim() || entry.data.category;

  return (
    <a
      href={`/journal/${entry.id}`}
      className="block group h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-green/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-2xl"
    >
      <NotebookCard className="h-full flex flex-col transition-all duration-300 group-hover:border-text/20">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-muted font-mono">{entry.data.date}</span>
          <Tag variant={entry.data.category.startsWith('Relearn Life') ? 'life' : 'engineering'}>
            {subCategory}
          </Tag>
        </div>
        <h3 className="text-lg font-semibold text-text mb-2 group-hover:text-note transition-colors">
          {entry.data.title}
        </h3>
        <p className="text-sm text-muted leading-relaxed mb-4 flex-grow line-clamp-3">
          {entry.data.summary}
        </p>
        <div className="flex items-center gap-2 text-sm text-muted group-hover:text-text transition-colors mt-auto">
          Read entry <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>
      </NotebookCard>
    </a>
  );
};
