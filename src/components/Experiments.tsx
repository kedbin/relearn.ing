import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardCheck, Compass, Target } from 'lucide-react';

const experimentCadence = [
  {
    title: 'Grading Myself in Public',
    description: 'Every Sunday I post three scores: hours actually building with AI (target: 15+), prompts shipped vs. prompts hoarded, and moments I reached for Google instead of my AI stack. Week 0 was humiliating (scores: 3, 0, 23).',
    icon: ClipboardCheck
  },
  {
    title: 'Agent Duel Logs',
    description: 'I take the same cloud task and run it through two different AI agents. Publish the diff, timing, and my emotional preference (which often contradicts the performance data). Results: Gemini CLI wins on cloud tasks, but I keep reaching for Claude Code.',
    icon: Compass
  },
  {
    title: 'Prompt Graveyard',
    description: 'For every successful prompt, I log 5-10 failed versions with specific error analysis. The goal is not to look smart—it is to prove I am actually iterating instead of copy-pasting from Twitter.',
    icon: Target
  }
];

export const Experiments = () => (
  <section className="py-24 relative">
    <div className="container mx-auto px-6">
      <div className="max-w-2xl mb-12">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-300 mb-3">Cadence</p>
        <h2 className="text-3xl font-display font-bold text-white mb-4">The experiments that keep me honest</h2>
        <p className="text-slate-300">
          These are not fluffy ideas—they’re recurring rituals on my calendar. They create proof that I’m improving, or evidence that something needs to change.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {experimentCadence.map((experiment, idx) => (
          <motion.div
            key={experiment.title}
            className="group p-7 rounded-2xl bg-gradient-to-br from-slate-900/70 to-slate-900/50 border border-slate-800/80 hover:border-brand-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/10"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <motion.div
              className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center mb-5 shadow-lg"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <experiment.icon className="w-7 h-7 text-brand-300 group-hover:text-brand-200 transition-colors" />
            </motion.div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-100 transition-colors">{experiment.title}</h3>
            <p className="text-slate-300 text-sm leading-relaxed group-hover:text-slate-200 transition-colors">{experiment.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);