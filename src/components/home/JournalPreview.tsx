import React from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import { NotebookCard } from '../ui/NotebookCard';
import { SectionHeader } from '../ui/SectionHeader';
import { Tag } from '../ui/Tag';

interface JournalEntry {
  id: string;
  data: {
    title: string;
    date: string;
    status: string;
    summary: string;
    category: string;
  };
  body?: string;
}

function readingTime(body?: string): number {
  if (!body) return 0;
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export const JournalPreview = ({ entries }: { entries: JournalEntry[] }) => {
  const latestEntries = entries.slice(0, 3);
  const featured = latestEntries[0];
  const rest = latestEntries.slice(1);

  return (
    <section className="py-24 px-6 border-t border-border/30">
      <div className="max-w-7xl mx-auto">
        <SectionHeader label="Journal" title="Latest from the Journal" />

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Featured Entry — text-led, no preview picture */}
          {featured && (
            <a
              href={`/journal/${featured.id}`}
              className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-green/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-2xl lg:row-span-2"
            >
              <NotebookCard className="h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-amber">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber" />
                    Latest Essay
                  </span>
                  <Tag variant={featured.data.category.startsWith('Relearn Life') ? 'life' : 'engineering'}>
                    {featured.data.category.split('/').pop()?.trim() || featured.data.category}
                  </Tag>
                </div>
                <h3 className="card-title text-2xl md:text-3xl text-text mb-3 group-hover:text-note transition-colors">
                  {featured.data.title}
                </h3>
                <p className="text-muted leading-relaxed mb-6 flex-grow">
                  {featured.data.summary}
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/30">
                  <span className="flex items-center gap-2 text-xs text-muted font-mono">
                    <Clock className="w-3 h-3" />
                    {readingTime(featured.body)} min read · {featured.data.date}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-note font-medium transition-all group-hover:gap-2">
                    Read <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </NotebookCard>
            </a>
          )}

          {/* Stacked Entries — text-led, no preview picture */}
          <div className="flex flex-col gap-4">
            {rest.map((entry) => (
              <a
                key={entry.id}
                href={`/journal/${entry.id}`}
                className="group block flex-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-green/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-2xl"
              >
                <NotebookCard className="h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag variant={entry.data.category.startsWith('Relearn Life') ? 'life' : 'engineering'}>
                      {entry.data.category.split('/').pop()?.trim() || entry.data.category}
                    </Tag>
                    <span className="flex items-center gap-1 text-xs text-muted font-mono">
                      <Clock className="w-3 h-3" />
                      {readingTime(entry.body)}m
                    </span>
                  </div>
                  <h3 className="card-title text-lg text-text mb-1.5 group-hover:text-note transition-colors">{entry.data.title}</h3>
                  <p className="text-sm text-muted line-clamp-2">{entry.data.summary}</p>
                  <ArrowRight className="w-4 h-4 mt-3 text-muted group-hover:text-text transition-all group-hover:translate-x-1" />
                </NotebookCard>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <a href="/journal" className="btn-ghost">
            View all entries <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
