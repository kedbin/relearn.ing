import React from 'react';
import { Mail } from 'lucide-react';

export const Newsletter = () => {
  const emailHref = 'mailto:newsletter@relearn.ing?subject=Join%20the%20Relearn%20Dispatch&body=Hey%20Kedbin%2C%20add%20me%20to%20your%20weekly%20update.%20Here%E2%80%99s%20what%20I%E2%80%99m%20working%20on%3A%20';

  return (
    <section id="newsletter" className="py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/80 pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto bg-slate-800/30 border border-slate-700/50 rounded-3xl p-8 md:p-12 backdrop-blur-md text-center">
          <Mail className="w-10 h-10 text-brand-400 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-display">Join the Dispatch</h2>
          <p className="text-slate-300 mb-6 text-lg">
            Weekly experiments, prompts, and emotional check-ins.
          </p>

          <a
            href={emailHref}
            className="inline-flex items-center justify-center px-8 py-3 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-full transition-all shadow-lg shadow-brand-500/20"
          >
            Email me to join
          </a>
          <p className="text-slate-400 text-sm mt-4">
            MVP Protocol: Opens your email client. I reply personally.
          </p>
        </div>
      </div>
    </section>
  );
};
