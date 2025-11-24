import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

export const ProblemSection = () => {
  const buckets = [
    {
      title: 'The Sprawl',
      subtitle: 'Too many tools, too many choices',
      bullets: [
        'Tech: I collected 6 AI agents (Gemini, Claude, Copilot) but used none effectively. Result: Analysis Paralysis.',
        'Life: I browsed 500 wedding dresses and research 10 diet protocols. Result: Decision Fatigue.',
        "The Fix: Artificial Constraints. Pick one tool. Pick one plan. Execute."
      ]
    },
    {
      title: 'The Illusion',
      subtitle: 'Performing work vs. Shipping value',
      bullets: [
        "Tech: I spent 47 hours 'evaluating' vector databases but wrote 0 lines of code.",
        'Life: I bought books on productivity but didn\'t sleep 8 hours.',
        'The Fix: Input/Output Accounting. If the output (shipped code/health) is zero, the input (research) was wasted.'
      ]
    },
    {
      title: 'The Debt',
      subtitle: 'Compounding interest on bad habits',
      bullets: [
        'Tech: My manual deployment scripts were \"comfortable\" but cost me 2 hours/week. That is 100 hours/year of waste.',
        'Life: My chaotic environment drained willpower battery every morning.',
        'The Fix: Refactoring. Stop paying interest. Invest time now to automate the future.'
      ]
    }
  ];

  return (
    <section id="problem" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">Why I'm rebuilding everything</h2>
          <p className="text-lg text-slate-300 leading-relaxed">
            I got tired of performing productivity. Every engineer I admired was shipping AI-augmented features while I was stuck in tutorial hell.
            Documenting my specific failures—from prompt waste to tool paralysis—became the only way out.
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {buckets.map((bucket, idx) => (
            <motion.div
              key={bucket.title}
              className="group bg-gradient-to-br from-slate-900/60 to-slate-900/40 border border-slate-800/80 p-8 rounded-2xl backdrop-blur-sm hover:border-red-500/30 hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2 group-hover:text-red-100 transition-colors">
                <AlertCircle className="w-5 h-5 text-red-400 group-hover:text-red-300" />
                {bucket.title}
              </h3>
              <p className="text-sm uppercase tracking-wide text-slate-500 mb-5">{bucket.subtitle}</p>
              <ul className="space-y-3.5 text-slate-300 text-sm">
                {bucket.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3 group-hover:text-slate-200 transition-colors">
                    <span className="text-brand-400 mt-1">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};