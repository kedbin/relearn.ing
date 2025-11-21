import React from 'react';
import { motion } from 'framer-motion';

const journeyPhases = [
  {
    phase: 'Phase 0',
    title: 'Kill the Tutorial Habit',
    description: 'Stop consuming, start building. Delete the bookmark folder of "AI tools to try" and pick exactly two that map to my actual day-job pain.',
    commitments: ['Count hours spent on tools vs. tutorials (target: 80% building, 20% learning)', 'Document the emotional resistance when reaching for Google instead of AI', 'Publish the first embarrassing GitHub repo: AI-assisted code with all my mistakes visible']
  },
  {
    phase: 'Phase 1',
    title: 'Prove Augmentation Actually Works',
    description: 'Turn AI from a toy into a teammate. Measure real velocity gains on actual cloud deployment tasks, not toy problems.',
    commitments: ['Time every deployment: manual vs. AI-assisted (minimum 10 tasks each)', 'Publish specific prompt templates that failed vs. ones that shipped code', 'Share the bash script that AI wrote and I was too proud to commit—but finally did']
  },
  {
    phase: 'Phase 2',
    title: 'Teach the Failure, Not the Success',
    description: 'The market is flooded with "AI changed my life" content. I will document the specific friction points so others can skip my wasted hours.',
    commitments: ['Open-source my prompt graveyard: 50+ failed attempts with error analysis', 'Host a live stream: "I\'m a cloud engineer who pretended to know AI for 6 months—here is what I actually learned"', 'Build a comparison matrix: when to use each agent (Gemini vs Claude vs Copilot) based on real tasks, not marketing']
  }
];

export const JourneySection = () => (
  <section id="journey" className="py-24">
    <div className="container mx-auto px-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-12">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-300 mb-3">Roadmap</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">How I’m rewriting my operating system</h2>
          <p className="text-slate-300">
            Structure keeps me honest. Each phase has specific deliverables, so I can measure whether I’m actually relearning—or just consuming content.
          </p>
        </div>
        <p className="text-slate-400 text-sm max-w-sm">
          Every log references these checkpoints, so you can trace experiment → lesson → habit.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {journeyPhases.map((phase, idx) => (
          <motion.div
            key={phase.phase}
            className="group p-7 rounded-2xl bg-gradient-to-br from-slate-900/60 to-slate-900/40 border border-slate-800/80 hover:border-brand-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.15 }}
            whileHover={{ y: -8 }}
          >
            <div className="inline-block px-3 py-1 rounded-lg bg-brand-500/10 text-sm font-bold text-brand-300 mb-3 border border-brand-500/20">
              {phase.phase}
            </div>
            <h3 className="text-2xl font-display text-white mb-3 group-hover:text-brand-100 transition-colors">{phase.title}</h3>
            <p className="text-slate-300 text-sm mb-5 leading-relaxed">{phase.description}</p>
            <ul className="space-y-2.5 text-sm text-slate-300">
              {phase.commitments.map((commitment) => (
                <li key={commitment} className="flex items-start gap-2.5">
                  <span className="text-brand-400 mt-1 text-base">•</span>
                  <span className="group-hover:text-slate-200 transition-colors">{commitment}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);