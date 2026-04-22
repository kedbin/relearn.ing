import React from 'react';
import { NotebookCard } from '../ui/NotebookCard';
import { HandwrittenNote } from '../ui/HandwrittenNote';

export const Newsletter = () => {
  const emailHref = 'mailto:newsletter@relearn.ing?subject=Join%20the%20Relearn%20Dispatch&body=Hey%20Kedbin%2C%20add%20me%20to%20your%20weekly%20update.%20Here%E2%80%99s%20what%20I%E2%80%99m%20working%20on%3A%20';

  return (
    <section className="py-24 px-6 border-t border-border/30">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <span className="label-mono block mb-3">Dispatch</span>
            <h2 className="display-serif text-3xl md:text-4xl text-text mb-4">
              Join the Dispatch
            </h2>
            <p className="text-muted leading-relaxed max-w-md">
              Weekly experiments, prompts, and emotional check-ins. No automation—just honest signal.
            </p>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-4">
            <a
              href={emailHref}
              className="px-8 py-3 bg-text text-bg font-semibold rounded-full hover:bg-muted transition-colors"
            >
              Email me to join
            </a>
            <HandwrittenNote rotation={-1} className="text-sm">
              MVP Protocol: Opens your email client. I reply personally.
            </HandwrittenNote>
          </div>
        </div>
      </div>
    </section>
  );
};
