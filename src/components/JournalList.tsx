import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { JournalCard } from './JournalCard';

interface JournalEntry {
  id: string;
  slug: string;
  data: {
    title: string;
    date: string;
    status: string;
    summary: string;
    category: string;
  };
}

export const JournalList = ({ entries }: { entries: JournalEntry[] }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | 'Life' | 'Engineering'>('All');

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const { title, summary, category } = entry.data;
      const searchLower = search.toLowerCase();
      
      const matchesSearch = 
        title.toLowerCase().includes(searchLower) ||
        summary.toLowerCase().includes(searchLower) ||
        category.toLowerCase().includes(searchLower);
      
      const matchesFilter = 
        filter === 'All' ? true : 
        filter === 'Life' ? category.startsWith('Relearn Life') :
        filter === 'Engineering' ? category.startsWith('Relearn Engineering') : true;

      return matchesSearch && matchesFilter;
    });
  }, [entries, search, filter]);

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between bg-slate-900/40 p-6 rounded-2xl border border-slate-800/50">
         {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search journals..." 
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-brand-500/50 transition-colors placeholder:text-slate-600"
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
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                filter === f 
                  ? 'bg-slate-100 text-slate-900 shadow-lg shadow-white/5' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {f === 'All' ? 'All Entries' : `Relearn ${f}`}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filteredEntries.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEntries.map((entry) => (
            <JournalCard key={entry.id} entry={entry} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 border border-dashed border-slate-800 rounded-2xl">
          <p className="text-slate-500">No entries found matching your criteria.</p>
          <button 
            onClick={() => { setSearch(''); setFilter('All'); }}
            className="mt-4 text-brand-400 hover:text-brand-300 text-sm"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};
