import React from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import { Tag } from './ui/Tag';
import { NotebookCard } from './ui/NotebookCard';

function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

interface JournalEntry {
  id: string;
  data: {
    title: string;
    date: string;
    status: string;
    summary: string;
    category: string;
  };
  body: string;
}

interface JournalCardProps {
  entry: JournalEntry;
  featured?: boolean;
}

export const JournalCard = ({ entry, featured = false }: JournalCardProps) => {
  const subCategory = entry.data.category.split('/').pop()?.trim() || entry.data.category;
  const readTime = estimateReadingTime(entry.body);

  if (featured) {
    return (
      <a
        href={`/journal/${entry.id}`}
        className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-green/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-2xl"
      >
        <NotebookCard className="h-full flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-amber">
              <span className="w-1.5 h-1.5 rounded-full bg-amber" />
              Latest Essay
            </span>
            <Tag variant={entry.data.category.startsWith('Relearn Life') ? 'life' : 'engineering'}>
              {subCategory}
            </Tag>
          </div>
          <h3 className="card-title text-2xl md:text-3xl text-text mb-3 group-hover:text-note transition-colors">
            {entry.data.title}
          </h3>
          <p className="text-muted leading-relaxed mb-5">
            {entry.data.summary}
          </p>
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/30">
            <span className="flex items-center gap-2 text-xs text-muted font-mono">
              <Clock className="w-3 h-3" />
              {readTime} min read · {entry.data.date}
            </span>
            <span className="flex items-center gap-1 text-sm text-note font-medium transition-all group-hover:gap-2">
              Read <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </NotebookCard>
      </a>
    );
  }

  // List-row card — text-led, no preview picture.
  return (
    <a
      href={`/journal/${entry.id}`}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-green/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-2xl"
    >
      <NotebookCard className="h-full">
        <div className="flex items-center gap-5">
          <div className="hidden sm:block shrink-0 pr-4 border-r border-border/40 text-right">
            <div className="font-mono text-xs text-muted">{entry.data.date}</div>
            <div className="mt-1 flex items-center justify-end gap-1 text-[11px] text-muted font-mono">
              <Clock className="w-3 h-3" />
              {readTime}m
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <Tag variant={entry.data.category.startsWith('Relearn Life') ? 'life' : 'engineering'} className="mb-1.5">
              {subCategory}
            </Tag>
            <h3 className="card-title text-lg text-text group-hover:text-note transition-colors">
              {entry.data.title}
            </h3>
            <p className="text-sm text-muted line-clamp-1 mt-1">{entry.data.summary}</p>
          </div>
          <ArrowRight className="shrink-0 w-4 h-4 text-muted group-hover:text-text group-hover:translate-x-1 transition-all" />
        </div>
      </NotebookCard>
    </a>
  );
};
