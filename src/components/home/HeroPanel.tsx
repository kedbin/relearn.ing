import React from 'react';
import { HandwrittenNote } from '../ui/HandwrittenNote';

export const HeroPanel = () => {
  return (
    <section className="relative min-h-[80vh] flex flex-col justify-center pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text */}
          <div>
            <h1 className="display-serif text-5xl md:text-6xl lg:text-7xl text-text mb-6">
              Relearning<br />
              how to work<br />
              and live<span className="text-green">.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted leading-relaxed max-w-lg mb-4">
              in the AI Era
            </p>
            <p className="text-lg text-muted leading-relaxed max-w-lg mb-8">
              Augmenting cognition, focus, and decision-making in daily life. Field notes on building a better operating system for the self.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="/journal"
                className="px-6 py-3 bg-text text-bg font-semibold rounded-full hover:bg-muted transition-colors"
              >
                Read the journal
              </a>
              <a
                href="/about"
                className="px-6 py-3 border border-border/60 text-text rounded-full hover:border-text/40 transition-colors"
              >
                About the experiment
              </a>
            </div>
          </div>

          {/* Right: Photo Card with Handwritten Note */}
          <div className="relative">
            <div className="absolute -top-4 -left-4 z-10">
              <HandwrittenNote rotation={-6} className="text-lg md:text-xl">
                Building a better<br />operating system<br />for me. →
              </HandwrittenNote>
            </div>
            <div className="rounded-2xl border border-border/60 bg-surface/50 p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
              <div className="relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-text/10 rounded-sm z-10" />
                <div className="overflow-hidden rounded-xl border border-border/40">
                  <img
                    src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"
                    alt="Mountain landscape"
                    className="w-full h-64 md:h-80 object-cover"
                  />
                </div>
              </div>
              <p className="text-center text-muted text-xs mt-3 font-mono uppercase tracking-wider">
                Field Note / somewhere
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
