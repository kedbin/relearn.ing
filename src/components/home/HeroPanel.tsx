import React from 'react';
import { TerminalBoot } from './TerminalBoot';

export const HeroPanel = () => {
  return (
    <section className="relative min-h-[80vh] flex flex-col justify-center pt-28 pb-16 px-6">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text */}
          <div>
            <span className="label-mono mb-5 inline-flex items-center gap-2 rounded-full border border-border/50 bg-surface-2/40 px-3 py-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green" />
              </span>
              Field notes · in the AI era
            </span>

            <h1 className="display-serif text-5xl md:text-6xl lg:text-7xl text-text mb-6">
              Relearning<br />
              how to work<br />
              and live<span className="text-green">.</span>
            </h1>
            <p className="text-xl md:text-2xl text-text/80 leading-snug max-w-lg mb-3">
              Augmenting cognition, focus & decision-making.
            </p>
            <p className="text-base md:text-lg text-muted leading-relaxed max-w-lg mb-9">
              An open lab notebook on building a better operating system for the self — debugging sleep, tools, and how we think.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a href="/journal" className="btn-primary">
                Read the journal <span aria-hidden="true">→</span>
              </a>
              <a href="/about" className="btn-ghost">
                About the experiment
              </a>
            </div>
          </div>

          {/* Right: animated terminal */}
          <div className="relative">
            <TerminalBoot />
          </div>
        </div>
      </div>
    </section>
  );
};
