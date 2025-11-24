import React from 'react';
import { motion } from 'framer-motion';

const journeyPhases = [
  {
    phase: 'Loop 1',
    title: 'Instrument the Black Box',
    description: 'You can\'t optimize what you don\'t measure. I\'m replacing vague "feelings" with rigorous observability.',
    commitments: [
      'Distributed Tracing → For backend latency AND daily energy levels.',
      'Log Aggregation → Centralizing cloud logs AND personal journal entries.',
      'Metrics → Dashboarding error rates AND habit compliance.'
    ]
  },
  {
    phase: 'Loop 2',
    title: 'Refactor the Monolith',
    description: 'Legacy code and bad habits share one trait: they resist change. I\'m decomposing big problems into atomic, shippable commits.',
    commitments: [
      'Decoupling → Separating concerns in Terraform modules AND work-life boundaries.',
      'Atomic Commits → Shipping small code changes AND small habit adjustments.',
      'Deprecation → Removing unused GCP resources AND toxic mental patterns.'
    ]
  },
  {
    phase: 'Loop 3',
    title: 'Chaos Engineering',
    description: 'Systems look great on a whiteboard but fail in production. I test my architectures (and routines) against reality.',
    commitments: [
      'Stress Testing → Pushing GCP limits AND my own focus endurance.',
      'Disaster Recovery → Automating backups AND having a plan for "off" days.',
      'Post-Mortems → Blameless analysis of server outages AND personal setbacks.'
    ]
  }
];

export const JourneySection = () => (
  <section id="journey" className="py-24">
    <div className="container mx-auto px-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-12">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-300 mb-3">The CI/CD Pipeline</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">The Infinite Loop</h2>
          <p className="text-slate-300">
            Relearning isn't a destination; it's a runtime environment. I treat personal growth like a continuous integration pipeline: commit, test, deploy, monitor, repeat.
          </p>
        </div>
        <p className="text-slate-400 text-sm max-w-sm">
          This roadmap is recursive. As soon as I finish Loop 3, I start Loop 1 again with better data.
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
                  <span className="text-brand-400 mt-1 text-base">→</span>
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