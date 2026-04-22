import React from 'react';
import { motion } from 'framer-motion';
import { NotebookCard } from '../ui/NotebookCard';
import { SectionHeader } from '../ui/SectionHeader';

const phases = [
  {
    phase: '01',
    title: 'Observability',
    description: 'Instrument everything. Metrics, logs, and honest awareness.',
    metric: 'Awareness Score',
    metricValue: '↑ week over week',
    ritual: 'Daily logs + weekly review.',
    explore: 'Friction Log',
  },
  {
    phase: '02',
    title: 'Refactoring',
    description: 'Remove friction. Improve systems.',
    metric: 'Friction Points',
    metricValue: '↓ over time',
    ritual: 'Weekly refactor session.',
    explore: 'System Patterns',
  },
  {
    phase: '03',
    title: 'Chaos Engineering',
    description: 'Stress test assumptions. Embrace uncertainty.',
    metric: 'Frictionless Score',
    metricValue: '↑ over time',
    ritual: 'Monthly discomfort experiment.',
    explore: 'Chaos Lab',
  },
];

export const PipelineTimeline = () => {
  return (
    <section className="py-24 px-6 border-t border-border/30">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          label="The Roadmap"
          title="The Pipeline"
          annotation="My operating system."
          description="Personal growth as a continuous integration pipeline: commit, test, deploy, monitor, repeat."
        />

        <div className="grid lg:grid-cols-3 gap-4">
          {phases.map((phase, idx) => (
            <motion.div
              key={phase.phase}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <NotebookCard>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-full bg-green/10 text-green text-xs font-mono flex items-center justify-center border border-green/20">
                    {phase.phase}
                  </span>
                  <div className="flex-1 h-px bg-border/40" />
                </div>

                <h3 className="text-lg font-semibold text-text mb-2">{phase.title}</h3>
                <p className="text-sm text-muted mb-5">{phase.description}</p>

                <div className="space-y-3 mb-5">
                  <div>
                    <span className="label-mono block mb-1">Key Metric</span>
                    <p className="text-sm text-text">{phase.metric}</p>
                    <p className="text-xs text-muted font-mono">{phase.metricValue}</p>
                  </div>
                  <div>
                    <span className="label-mono block mb-1">Ritual</span>
                    <p className="text-sm text-muted">{phase.ritual}</p>
                  </div>
                </div>

                <a href="#" className="text-xs text-note hover:text-text transition-colors flex items-center gap-1">
                  Explore → <span className="text-muted">{phase.explore}</span>
                </a>
              </NotebookCard>
            </motion.div>
          ))}
        </div>

        {/* Pipeline Diagram */}
        <div className="mt-12 flex justify-center">
          <div className="relative p-8 rounded-2xl border border-border/60 bg-surface/30 max-w-sm w-full">
            <span className="label-mono absolute top-3 left-4">v1.0</span>
            <div className="flex flex-col items-center gap-3 mt-4">
              {['Observe\n(collect)', 'Refactor\n(improve)', 'Stress Test\n(break)', 'Iterate\n(repeat)'].map((step, i) => (
                <React.Fragment key={step}>
                  <div className="px-4 py-2 rounded-lg border border-border/60 bg-surface/60 text-xs text-text text-center font-mono whitespace-pre">
                    {step}
                  </div>
                  {i < 3 && (
                    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" className="text-muted">
                      <path d="M10 0v16M2 8l8 8 8-8" stroke="currentColor" strokeWidth="1" />
                    </svg>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
