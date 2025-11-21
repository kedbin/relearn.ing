import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

export const ProblemSection = () => {
  const buckets = [
    {
      title: 'Tool Hoarding',
      subtitle: 'The choice paralysis that broke me',
      bullets: [
        'I collected 6 AI agents like Pokemon cards: Gemini CLI, Copilot, Claude Code, Kimi K2, GLM 4.6. Used zero of them in my actual workflow.',
        'Every tutorial promised "10x productivity" but I was too scared to delete my manual processes.',
        "I measured it: 47 hours spent 'evaluating' tools, 0 hours shipping with them. The shame was motivational."
      ]
    },
    {
      title: 'The Hype Spiral',
      subtitle: 'Drowning in potential, starving for proof',
      bullets: [
        "I could quote every AI paper but couldn't show one feature I shipped using AI in my day job.",
        'Each new model drop (Gemini Pro 3.0, Kimi K2) made me feel further behind, not more capable.',
        'The breaking point: I caught myself doom-scrolling AI Twitter instead of writing the prompt that would actually fix my broken deployment script.'
      ]
    },
    {
      title: 'Workflow Fossilization',
      subtitle: 'The comfort zone that became a cage',
      bullets: [
        'My brain still defaults to Google + Stack Overflow, even with Claude Code one terminal tab away.',
        'Every time I typed the same bash command for the 100th time, I heard a voice: "You should automate this." I ignored it 99 times.',
        'The real blocker was emotional: What if the AI-generated code breaks production? My manual scripts felt safe—even when they were slow and wrong.'
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