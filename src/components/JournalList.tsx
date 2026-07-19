import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
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

/**
 * Extract the top-level domain from a category string.
 * Categories look like "Relearn Engineering / AI Engineering" or
 * "Relearn Life / Behavioral Economics" -> the segment before the slash,
 * with the "Relearn " prefix stripped. "AI Engineering" normalises to
 * "Engineering" so the oddball entry groups correctly.
 *
 * Filters are DERIVED from these domains (see filters below), so a bucket
 * with zero entries can never appear — no more dead "Productivity" pill —
 * and "Systems" (always a sub-category) is folded into its parent domain
 * instead of being its own redundant filter.
 */
export function topDomain(category: string): string {
  let head = category.split('/')[0].trim();
  head = head.replace(/^Relearn\s+/i, '');
  if (/^AI\s+Engineering$/i.test(head)) head = 'Engineering';
  return head || 'Engineering';
}

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
  const [filter, setFilter] = useState<string>('All');

  // Baseline filter taxonomy, derived from content: "All" + every top-level
  // domain that actually has entries, sorted by count desc. Buckets with no
  // entries are impossible here, so filters can never show an empty list.
  const filters = useMemo(() => {
    const counts = new Map<string, number>();
    for (const entry of entries) {
      const d = topDomain(entry.data.category);
      counts.set(d, (counts.get(d) ?? 0) + 1);
    }
    const domains = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([d]) => d);
    return ['All', ...domains];
  }, [entries]);

  const filteredByCategory = useMemo(() => {
    if (filter === 'All') return entries;
    return entries.filter((entry) => topDomain(entry.data.category) === filter);
  }, [entries, filter]);

  const fuse = useMemo(() => new Fuse(filteredByCategory, FUSE_OPTIONS), [filteredByCategory]);

  const filteredEntries = useMemo(() => {
    if (!search.trim()) return filteredByCategory;
    const results = fuse.search(search);
    return results.map(result => result.item);
  }, [filteredByCategory, search, fuse]);

  const featured = filteredEntries[0];
  const rest = filteredEntries.slice(1);

  // If the active filter ever has no entries (e.g. content changed), fall back
  // to "All" so the page is never empty.
  const safeFilter = filters.includes(filter) ? filter : 'All';
  const showingAll = safeFilter === 'All';

  return (
    <div className="w-full">
      {/* Filters + Search */}
      <div className="flex flex-col lg:flex-row gap-6 mb-10 items-start lg:items-center justify-between">
        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border ${
                safeFilter === f
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
          {/* Featured Hero — only on the unfiltered default view */}
          {featured && !search.trim() && showingAll && (
            <JournalCard entry={featured} featured />
          )}

          {/* Divider */}
          {featured && !search.trim() && showingAll && rest.length > 0 && (
            <div className="flex items-center gap-4 pt-4">
              <span className="label-mono">More essays</span>
              <div className="flex-1 h-px bg-border/30" />
            </div>
          )}

          {/* Editorial List */}
          <div className="grid gap-4">
            {(search.trim() || !showingAll ? filteredEntries : rest).map((entry) => (
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
