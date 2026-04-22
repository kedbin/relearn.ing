import React from 'react';
import { motion } from 'framer-motion';
import { NotebookCard } from '../ui/NotebookCard';
import { SectionHeader } from '../ui/SectionHeader';

export const ProblemSection = () => {
  const buckets = [
    {
      title: 'Signal Saturation',
      subtitle: 'Input Overflow',
      observed: 'Many tabs open, no real progress.',
      fix: 'Input fasting + curated feeds.',
    },
    {
      title: 'IO Wait',
      subtitle: 'High Latency',
      observed: 'Hours consumed, nothing published.',
      fix: 'Ship tiny things consistently.',
    },
    {
      title: 'Tech Debt',
      subtitle: 'Compounding Interest',
      observed: 'Friction reappears in cycles.',
      fix: 'Capture, reflect, refactor.',
    },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          label="System Status: Degraded"
          title="Why Relearn?"
          annotation="Observed problems."
          description="Documenting specific failures—from prompt waste to tool paralysis."
        />

        <div className="grid md:grid-cols-3 gap-4">
          {buckets.map((bucket, idx) => (
            <motion.div
              key={bucket.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <NotebookCard>
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-2xl font-mono text-muted opacity-40">0{idx + 1}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-text">{bucket.title}</h3>
                    <p className="text-xs text-muted uppercase tracking-wider">{bucket.subtitle}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="label-mono block mb-1">Observed</span>
                    <p className="text-sm text-muted">{bucket.observed}</p>
                  </div>
                  <div>
                    <span className="label-mono block mb-1">Current Fix</span>
                    <p className="text-sm text-text">{bucket.fix}</p>
                  </div>
                </div>
              </NotebookCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
