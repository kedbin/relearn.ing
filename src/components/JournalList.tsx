import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import Fuse from 'fuse.js';
import { JournalCard } from './JournalCard';
import { NotebookCard } from './ui/NotebookCard';

interface JournalEntry {
  id: string;
  slug: string;
  data: {
    title: string;
    date: string;
    status: string;
    summary: string;
    category: string;
    highlights: string[];
  };
  body: string;
}

const FUSE_OPTIONS = {
  keys: [
    { name: 'data.title', weight: 2 },
    { name: 'data.summary', weight: 1.5 },
    { name: 'data.category', weight: 1 },
    { name: 'data.highlights', weight: 1 },
    { name: 'body', weight: 0.8 },
  ],
  threshold: 0.4,
  ignoreLocation: true,
  includeScore: true,
  minMatchCharLength: 2,
};

export const JournalList = ({ entries }: { entries: JournalEntry[] }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | 'Life' | 'Engineering'>('All');

  const filteredByCategory = useMemo(() => {
    if (filter === 'All') return entries;
    return entries.filter((entry) => {
      const { category } = entry.data;
      if (filter === 'Life') return category.startsWith('Relearn Life');
      if (filter === 'Engineering') return category.startsWith('Relearn Engineering');
      return true;
    });
  }, [entries, filter]);

  const fuse = useMemo(() => new Fuse(filteredByCategory, FUSE_OPTIONS), [filteredByCategory]);

  const filteredEntries = useMemo(() => {
    if (!search.trim()) return filteredByCategory;
    const results = fuse.search(search);
    return results.map(result => result.item);
  }, [filteredByCategory, search, fuse]);

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search titles, content, keywords..."
            className="w-full bg-surface border border-border/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-text focus:outline-none focus:border-text/30 transition-colors placeholder:text-muted/50"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {(['All', 'Life', 'Engineering'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap border ${
                filter === f
                  ? 'bg-text text-bg border-text'
                  : 'text-muted hover:text-text border-border/40 hover:border-text/20'
              }`}
            >
              {f === 'All' ? 'All Entries' : `Relearn ${f}`}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {search.trim() && (
        <p className="text-sm text-muted mb-6">
          {filteredEntries.length} result{filteredEntries.length !== 1 ? 's' : ''} for "{search}"
        </p>
      )}

      {/* Grid */}
      {filteredEntries.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEntries.map((entry) => (
            <JournalCard key={entry.id} entry={entry} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 border border-dashed border-border/40 rounded-2xl">
          <p className="text-muted">No entries found matching your criteria.</p>
          <button
            onClick={() => { setSearch(''); setFilter('All'); }}
            className="mt-4 text-note hover:text-text text-sm"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};
