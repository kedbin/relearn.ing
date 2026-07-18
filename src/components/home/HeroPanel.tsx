import React from 'react';
import { ArrowRight } from 'lucide-react';
import { HandwrittenNote } from '../ui/HandwrittenNote';
import { GenerativeThumbnail } from '../GenerativeThumbnail';

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
            <p className="text-xl md:text-2xl text-text/90 leading-snug max-w-lg mb-3 font-medium">
              Augmenting cognition, focus & decision-making.
            </p>
            <p className="text-base md:text-lg text-muted leading-relaxed max-w-lg mb-9">
              An open lab notebook on building a better operating system for the self — debugging sleep, tools, and how we think.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a href="/journal" className="btn-primary">
                Read the journal <ArrowRight className="w-4 h-4" />
              </a>
              <a href="/about" className="btn-ghost">
                About the experiment
              </a>
            </div>
          </div>

          {/* Right: Generative artifact card with Handwritten Note */}
          <div className="relative">
            <div className="absolute -top-5 -left-3 z-10">
              <HandwrittenNote rotation={-6} className="text-lg md:text-xl">
                Building a better<br />operating system<br />for me. →
              </HandwrittenNote>
            </div>
            <div className="rounded-2xl border border-border/55 bg-surface/50 p-3 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.8)]">
              <div className="relative">
                <div className="absolute -top-3 left-1/2 z-10 h-6 w-24 -translate-x-1/2 rounded-sm bg-text/10" />
                <div className="overflow-hidden rounded-xl border border-border/40">
                  <GenerativeThumbnail seed="relearning-hero" className="h-64 w-full md:h-80" />
                </div>
              </div>
              <div className="flex items-center justify-between px-1 pt-3">
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted">
                  Field Note / live build
                </p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-green">
                  ● shipped
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
