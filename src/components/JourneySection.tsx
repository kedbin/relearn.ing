import React from 'react';
import { m, LazyMotion, domAnimation } from 'framer-motion';

const journeyPhases = [
  {
    phase: 'Phase 1',
    title: 'Observability',
    description: 'Replacing vague "feelings" with rigorous metrics.',
    commitments: [
      'Tracing → Backend latency AND daily energy levels.',
      'Logs → Centralizing cloud logs AND journal entries.',
      'Metrics → Dashboarding error rates AND habit compliance.'
    ]
  },
  {
    phase: 'Phase 2',
    title: 'Refactoring',
    description: 'Decomposing big problems into atomic commits.',
    commitments: [
      'Decoupling → Terraform modules AND work-life boundaries.',
      'Atomic Commits → Small code changes AND small habit adjustments.',
      'Deprecation → Removing unused resources AND toxic patterns.'
    ]
  },
  {
    phase: 'Phase 3',
    title: 'Chaos Engineering',
    description: 'Testing architectures against reality.',
    commitments: [
      'Stress Testing → Pushing limits AND focus endurance.',
      'Disaster Recovery → Automating backups AND "off" day plans.',
      'Post-Mortems → Blameless analysis of outages AND setbacks.'
    ]
  }
];

export const JourneySection = () => (
  <section id="journey" className="py-24">
    <div className="container mx-auto px-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-12">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-300 mb-3">The Roadmap</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">CI/CD Pipeline</h2>
          <p className="text-slate-300">
            Personal growth as a continuous integration pipeline: commit, test, deploy, monitor, repeat.
          </p>
        </div>
        <p className="text-slate-400 text-sm max-w-sm">
          Recursive. Finish Phase 3 -&gt; Return to Phase 1 with better data.
        </p>
      </div>

      <LazyMotion features={domAnimation}>
        <div className="grid lg:grid-cols-3 gap-6">
          {journeyPhases.map((phase, idx) => (
            <m.div
              key={phase.phase}
              className="group p-8 rounded-2xl bg-gradient-to-br from-slate-900/60 to-slate-900/40 border border-slate-800/80 hover:border-brand-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-1 h-full flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className="inline-block px-3 py-1 rounded-lg bg-brand-500/10 text-sm font-bold text-brand-300 mb-3 border border-brand-500/20">
                {phase.phase}
              </div>
              <h3 className="text-2xl font-display text-white mb-3 group-hover:text-brand-100 transition-colors">{phase.title}</h3>
              <p className="text-slate-300 text-sm mb-5 leading-relaxed">{phase.description}</p>
              <ul className="space-y-2.5 text-sm text-slate-300 flex-grow">
                {phase.commitments.map((commitment) => (
                  <li key={commitment} className="flex items-start gap-2.5">
                    <span className="text-brand-400 mt-1 text-base">→</span>
                    <span className="group-hover:text-slate-200 transition-colors">{commitment}</span>
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