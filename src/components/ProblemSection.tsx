import React from 'react';
import { m, LazyMotion, domAnimation } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

export const ProblemSection = () => {
  const buckets = [
    {
      title: 'Signal Saturation',
      subtitle: 'Input Overflow',
      bullets: [
        'Problem: Too many inputs (tools, advice).',
        'Result: Zero throughput (Analysis Paralysis).',
        "Fix: Artificial Constraints. Pick one tool. Execute."
      ]
    },
    {
      title: 'IO Wait',
      subtitle: 'High Latency',
      bullets: [
        "Problem: High CPU usage (research) with no Disk Writes (shipping).",
        'Result: Performing work vs Shipping value.',
        'Fix: IO Accounting. If output is zero, input was wasted.'
      ]
    },
    {
      title: 'Tech Debt',
      subtitle: 'Compounding Interest',
      bullets: [
        'Problem: Manual processes compounding into bankruptcy.',
        'Result: Willpower battery drain.',
        'Fix: Refactoring. Invest time now to automate the future.'
      ]
    }
  ];

  return (
    <section id="problem" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">Why Relearn? System Status: Degraded</h2>
          <p className="text-lg text-slate-300 leading-relaxed">
            Documenting specific failures—from prompt waste to tool paralysis.
          </p>
        </div>

        <LazyMotion features={domAnimation}>
          <div className="grid md:grid-cols-3 gap-6">
            {buckets.map((bucket, idx) => (
              <m.div
                key={bucket.title}
                className="group p-8 rounded-2xl bg-gradient-to-br from-slate-900/60 to-slate-900/40 border border-slate-800/80 hover:border-brand-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-1 h-full flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2 group-hover:text-brand-100 transition-colors">
                  <AlertCircle className="w-5 h-5 text-brand-400 group-hover:text-brand-300" />
                  {bucket.title}
                </h3>
                <p className="text-sm uppercase tracking-wide text-slate-500 mb-5">{bucket.subtitle}</p>
                <ul className="space-y-3.5 text-slate-300 text-sm flex-grow">
                  {bucket.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3 group-hover:text-slate-200 transition-colors">
                      <span className="text-brand-400 mt-1">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </m.div>
            ))}
          </div>
        </LazyMotion>
      </div>
    </section>
  );
};