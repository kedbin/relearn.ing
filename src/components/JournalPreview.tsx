import React from 'react';
import { ArrowRight } from 'lucide-react';

interface JournalEntry {
  id: string;
  slug: string;
  data: {
    title: string;
    date: string;
    status: string;
    summary: string;
  };
}

export const JournalPreview = ({ entries }: { entries: JournalEntry[] }) => {
  const latestEntries = entries.slice(0, 3);
  const hasEntries = latestEntries.length > 0;

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-10">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-300 mb-3">Journal</p>
            <h2 className="text-3xl font-display font-bold text-white">Latest entries</h2>
            <p className="text-slate-300 mt-3 max-w-xl">
              Research-backed essays on productivity, cognition, and self-engineering.
            </p>
          </div>
          <a
            href="/journal"
            className="self-start md:self-auto px-6 py-3 border border-slate-700 text-white rounded-full hover:border-white/70 transition-colors"
          >
            Browse the journal
          </a>
        </div>

        {hasEntries ? (
          <div className="grid md:grid-cols-3 gap-6">
            {latestEntries.map((entry) => (
              <article key={entry.id} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between group hover:border-brand-500/30 transition-colors">
                <div>
                  <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-400 mb-3">
                    <span>{entry.data.date}</span>
                    <span className="text-brand-300">{entry.data.status}</span>
                  </div>
                  <h3 className="text-xl font-display text-white mb-3 group-hover:text-brand-100 transition-colors">{entry.data.title}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{entry.data.summary}</p>
                </div>
                <a
                  href={`/journal/${entry.slug}`}
                  className="mt-5 text-sm text-brand-300 flex items-center gap-2 font-semibold hover:text-brand-200 transition-colors text-left"
                >
                  <ArrowRight className="w-4 h-4" /> Read log
                </a>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-8 text-slate-300">
            <h3 className="text-xl font-display text-white mb-3">No published logs yet</h3>
            <p className="text-slate-400">Check back soon for the first entry.</p>
          </div>
        )}
      </div>
    </section>
  );
};
