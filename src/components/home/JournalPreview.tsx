import React from 'react';
import { ArrowRight } from 'lucide-react';
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
}

export const JournalPreview = ({ entries }: { entries: JournalEntry[] }) => {
  const latestEntries = entries.slice(0, 3);
  const featured = latestEntries[0];
  const rest = latestEntries.slice(1);

  return (
    <section className="py-24 px-6 border-t border-border/30">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          label="Journal"
          title="Latest from the Journal"
          annotation="Thinking out loud."
        />

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Featured Entry */}
          {featured && (
            <a
              href={`/journal/${featured.id}`}
              className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-green/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-2xl lg:row-span-2"
            >
              <NotebookCard className="h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <Tag variant={featured.data.category.startsWith('Relearn Life') ? 'life' : 'engineering'}>
                    {featured.data.category.split('/').pop()?.trim() || featured.data.category}
                  </Tag>
                  <span className="text-xs text-muted font-mono">{featured.data.date}</span>
                </div>
                <h3 className="display-serif text-2xl md:text-3xl text-text mb-3 group-hover:text-note transition-colors">
                  {featured.data.title}
                </h3>
                <p className="text-muted leading-relaxed mb-6 flex-grow">
                  {featured.data.summary}
                </p>
                <span className="text-sm text-note flex items-center gap-2 group-hover:text-text transition-colors">
                  Read more →
                </span>
              </NotebookCard>
            </a>
          )}

          {/* Stacked Entries */}
          <div className="flex flex-col gap-4">
            {rest.map((entry) => (
              <a
                key={entry.id}
                href={`/journal/${entry.id}`}
                className="group block flex-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-green/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-2xl"
              >
                <NotebookCard className="h-full">
                  <div className="flex items-center gap-3 mb-2">
                    <Tag variant={entry.data.category.startsWith('Relearn Life') ? 'life' : 'engineering'}>
                      {entry.data.category.split('/').pop()?.trim() || entry.data.category}
                    </Tag>
                    <span className="text-xs text-muted font-mono">{entry.data.date}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-text mb-1 group-hover:text-note transition-colors">{entry.data.title}</h3>
                  <p className="text-sm text-muted line-clamp-2">{entry.data.summary}</p>
                </NotebookCard>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <a
            href="/journal"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-text transition-colors"
          >
            View all entries <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
