import React from 'react';
import { ClipboardCheck, Compass, Target } from 'lucide-react';

const experimentCadence = [
  {
    title: 'The Friction Log',
    description: 'I carry a small notebook to log every moment of resistance. If I sigh while doing a task, I write it down. This is my error log for life.',
    icon: ClipboardCheck
  },
  {
    title: 'The Agent Duel',
    description: 'I solve every significant coding problem twice: once with Gemini, once with Claude. The diff reveals the truth about the models, not the marketing.',
    icon: Compass
  },
  {
    title: 'The Output Ratio',
    description: 'Every Sunday, I calculate my Input (Hours researched) vs Output (Words/Code shipped). If the ratio is < 1, I treat it as a system failure.',
    icon: Target
  }
];

export const Experiments = () => (
  <section className="py-24 relative">
    <div className="container mx-auto px-6">
      <div className="max-w-2xl mb-12">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-300 mb-3">Rituals</p>
        <h2 className="text-3xl font-display font-bold text-white mb-4">The experiments that keep me honest</h2>
        <p className="text-slate-300 leading-relaxed">
          These are not fluffy ideas—they’re recurring rituals on my calendar. They create proof that I’m improving, or evidence that something needs to change.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {experimentCadence.map((experiment) => (
          <div
            key={experiment.title}
            className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col group hover:border-brand-500/30 transition-colors"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-slate-800/50 text-brand-300 group-hover:text-brand-200 group-hover:bg-brand-500/10 transition-colors">
                <experiment.icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-display font-bold text-white group-hover:text-brand-100 transition-colors">
                {experiment.title}
              </h3>
            </div>
            
            <p className="text-slate-300 text-sm leading-relaxed">
              {experiment.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);