import React, { useState, useMemo } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import Fuse from 'fuse.js';
import { JournalCard } from './JournalCard';

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

const FILTERS = ['All', 'Life', 'Engineering', 'Systems', 'Productivity'] as const;

type FilterValue = (typeof FILTERS)[number];

const FUSE_OPTIONS = {
  keys: [
    { name: 'data.title', weight: 2 },
    { name: 'data.summary', weight: 1.5 },
    { name: 'data.category', weight: 1 },
    { name: 'body', weight: 0.8 },
  ],
  threshold: 0.4,
  ignoreLocation: true,
  includeScore: true,
  minMatchCharLength: 2,
};

export const JournalList = ({ entries }: { entries: JournalEntry[] }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterValue>('All');

  const filteredByCategory = useMemo(() => {
    if (filter === 'All') return entries;
    return entries.filter((entry) => {
      const { category } = entry.data;
      const catLower = category.toLowerCase();
      if (filter === 'Life') return catLower.includes('life');
      if (filter === 'Engineering') return catLower.includes('engineering');
      if (filter === 'Systems') return catLower.includes('systems');
      if (filter === 'Productivity') return catLower.includes('productivity');
      return true;
    });
  }, [entries, filter]);

  const fuse = useMemo(() => new Fuse(filteredByCategory, FUSE_OPTIONS), [filteredByCategory]);

  const filteredEntries = useMemo(() => {
    if (!search.trim()) return filteredByCategory;
    const results = fuse.search(search);
    return results.map(result => result.item);
  }, [filteredByCategory, search, fuse]);

  const featured = filteredEntries[0];
  const rest = filteredEntries.slice(1);

  return (
    <div className="w-full">
      {/* Filters + Search */}
      <div className="flex flex-col lg:flex-row gap-6 mb-10 items-start lg:items-center justify-between">
        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border ${
                filter === f
                  ? 'bg-text text-bg border-text'
                  : 'text-muted hover:text-text border-border/40 hover:border-text/20'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search entries..."
            aria-label="Search journal entries"
            className="w-full bg-surface border border-border/60 rounded-full pl-10 pr-4 py-2 text-sm text-text focus:outline-none focus:border-text/30 transition-colors placeholder:text-muted/50"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Results count */}
      {search.trim() && (
        <p className="text-sm text-muted mb-6">
          {filteredEntries.length} result{filteredEntries.length !== 1 ? 's' : ''} for "{search}"
        </p>
      )}

      {filteredEntries.length > 0 ? (
        <div className="space-y-6">
          {/* Featured Hero */}
          {featured && !search.trim() && filter === 'All' && (
            <JournalCard entry={featured} featured />
          )}

          {/* Divider */}
          {featured && !search.trim() && filter === 'All' && rest.length > 0 && (
            <div className="flex items-center gap-4 pt-4">
              <span className="label-mono">More essays</span>
              <div className="flex-1 h-px bg-border/30" />
            </div>
          )}

          {/* Editorial List */}
          <div className="grid gap-4">
            {(search.trim() || filter !== 'All' ? filteredEntries : rest).map((entry) => (
              <JournalCard key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-24 border border-dashed border-border/40 rounded-2xl">
          <p className="text-muted">No entries found matching your criteria.</p>
          <button
            type="button"
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
