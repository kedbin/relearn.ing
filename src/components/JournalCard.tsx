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
    category: string;
  };
}

interface JournalCardProps {
    entry: JournalEntry;
}

export const JournalCard = ({ entry }: JournalCardProps) => {
    // Helper for styles
    const getCardStyle = (category: string) => {
        if (category.startsWith('Relearn Life')) {
            return "border-slate-800 hover:border-purple-500/30 hover:bg-purple-900/10";
        }
        if (category.startsWith('Relearn Engineering')) {
            return "border-slate-800 hover:border-cyan-500/30 hover:bg-cyan-900/10";
        }
        return "border-slate-800 hover:border-brand-500/30";
    };

    const getSubCategory = (category: string) => {
        const parts = category.split('/');
        return parts.length > 1 ? parts[1].trim() : parts[0];
    }

    const cardStyle = getCardStyle(entry.data.category);
    const subCategory = getSubCategory(entry.data.category);

    return (
        <a
            href={`/journal/${entry.slug}`}
            className="block group h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded-2xl"
        >
            <article className={`p-6 rounded-2xl bg-slate-900/60 border flex flex-col justify-between transition-all duration-300 h-full ${cardStyle}`}>
                <div>
                    <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-400 mb-4">
                        <span className="font-mono">{entry.data.date}</span>
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                            entry.data.category.startsWith('Relearn Life') ? 'bg-purple-900/20 text-purple-300' :
                            entry.data.category.startsWith('Relearn Engineering') ? 'bg-cyan-900/20 text-cyan-300' :
                            'bg-slate-800 text-slate-300'
                        }`}>
                            {subCategory}
                        </span>
                    </div>
                    <h3 className="text-xl font-display text-white mb-3 group-hover:text-white transition-colors">
                        {entry.data.title}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed mb-6 line-clamp-3">
                        {entry.data.summary}
                    </p>
                </div>

                <div
                    className="flex items-center gap-2 text-sm font-medium text-slate-400 group-hover:text-brand-300 transition-colors mt-auto"
                >
                    Read entry <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
            </article>
        </a>
    );
};
