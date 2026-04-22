import React from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import { Tag } from './ui/Tag';

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

// Abstract thumbnail placeholder with gradient orbs
const ThumbnailPlaceholder = ({ seed }: { seed: number }) => {
  const hues = [
    'from-green/20 via-transparent to-transparent',
    'from-note/15 via-transparent to-transparent',
    'from-amber/15 via-transparent to-transparent',
    'from-redsoft/15 via-transparent to-transparent',
  ];
  const hue = hues[seed % hues.length];
  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl bg-surface2">
      <div className={`absolute inset-0 bg-radial-gradient ${hue}`} />
      <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-text/[0.03] blur-xl" />
      <div className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 rounded-full bg-text/[0.02] blur-lg" />
    </div>
  );
};

export const JournalCard = ({ entry, featured = false }: JournalCardProps) => {
  const subCategory = entry.data.category.split('/').pop()?.trim() || entry.data.category;
  const readTime = estimateReadingTime(entry.body);

  if (featured) {
    return (
      <a
        href={`/journal/${entry.id}`}
        className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-green/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-2xl"
      >
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8 items-center rounded-2xl border border-border/60 bg-surface/40 p-6 md:p-8 transition-all duration-300 group-hover:border-text/20">
          <div className="order-2 lg:order-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-amber">
                <span className="w-1.5 h-1.5 rounded-full bg-amber" />
                Latest Essay
              </span>
            </div>
            <h3 className="display-serif text-3xl md:text-4xl text-text mb-4 group-hover:text-note transition-colors">
              {entry.data.title}
            </h3>
            <p className="text-muted leading-relaxed mb-6 max-w-lg">
              {entry.data.summary}
            </p>
            <div className="flex items-center gap-3 text-xs text-muted font-mono">
              <span>{entry.data.date}</span>
              <span className="w-px h-3 bg-border/40" />
              <Tag variant={entry.data.category.startsWith('Relearn Life') ? 'life' : 'engineering'}>
                {subCategory}
              </Tag>
              <span className="w-px h-3 bg-border/40" />
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {readTime} min read
              </span>
            </div>
          </div>
          <div className="order-1 lg:order-2 h-48 md:h-64">
            <ThumbnailPlaceholder seed={entry.id.charCodeAt(0)} />
          </div>
        </div>
      </a>
    );
  }

  return (
    <a
      href={`/journal/${entry.id}`}
      className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-green/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-2xl"
    >
      <div className="grid md:grid-cols-[200px_1fr] gap-5 rounded-2xl border border-border/60 bg-surface/40 p-4 transition-all duration-300 group-hover:border-text/20">
        <div className="h-40 md:h-full min-h-[120px]">
          <ThumbnailPlaceholder seed={entry.id.charCodeAt(0)} />
        </div>
        <div className="flex flex-col justify-center py-2">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs text-muted font-mono">{entry.data.date}</span>
            <Tag variant={entry.data.category.startsWith('Relearn Life') ? 'life' : 'engineering'}>
              {subCategory}
            </Tag>
          </div>
          <h3 className="display-serif text-xl md:text-2xl text-text mb-2 group-hover:text-note transition-colors">
            {entry.data.title}
          </h3>
          <p className="text-sm text-muted leading-relaxed mb-3 line-clamp-2">
            {entry.data.summary}
          </p>
          <div className="flex items-center justify-between mt-auto">
            <span className="flex items-center gap-1 text-xs text-muted font-mono">
              <Clock className="w-3 h-3" />
              {readTime} min read
            </span>
            <ArrowRight className="w-4 h-4 text-muted group-hover:text-text transition-all group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </a>
  );
};
