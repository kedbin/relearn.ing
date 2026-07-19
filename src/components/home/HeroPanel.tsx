import React from 'react';
import { HandwrittenNote } from '../ui/HandwrittenNote';

/*
  Hero right panel = a composed "system status" mock instead of an abstract
  thumbnail. Whole-page Gemini critiques (light + dark) showed the previous
  GenerativeThumbnail here rendered as a broken skeleton-loader box. This mock
  communicates the thesis ("an operating system for the self") at a glance and
  is never empty.
*/
const Sparkline = () => {
  const pts = [12, 8, 14, 6, 18, 9, 20, 7, 16, 11, 22, 13];
  const max = Math.max(...pts);
  const w = 100;
  const h = 32;
  const step = w / (pts.length - 1);
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${(i * step).toFixed(1)} ${(h - (p / max) * h).toFixed(1)}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-8 w-full" preserveAspectRatio="none">
      <path d={`${d} L ${w} ${h} L 0 ${h} Z`} fill="rgb(var(--green))" opacity="0.12" />
      <path d={d} fill="none" stroke="rgb(var(--green))" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
};

const Metric = ({ label, value, accent }: { label: string; value: string; accent: string }) => (
  <div className="rounded-lg border border-border/50 bg-surface/60 px-3 py-2">
    <div className="label-mono !text-[9px]" style={{ color: accent }}>{label}</div>
    <div className="font-mono text-sm text-text">{value}</div>
  </div>
);

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

          {/* Right: System-status mock */}
          <div className="relative">
            <div className="absolute -top-6 -left-2 z-10">
              <HandwrittenNote rotation={-6} className="text-xl md:text-2xl !text-note">
                Building a better<br />operating system<br />for me. →
              </HandwrittenNote>
            </div>

            <div className="notebook-card !p-0 overflow-hidden">
              {/* terminal title bar */}
              <div className="flex items-center gap-2 border-b border-border/50 bg-surface-2/50 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-redsoft/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-green/80" />
                <span className="ml-2 font-mono text-[11px] text-muted">~/relearn — status</span>
              </div>

              <div className="p-5">
                {/* live metrics */}
                <div className="grid grid-cols-3 gap-2.5 mb-4">
                  <Metric label="Sleep" value="7.1h" accent="rgb(var(--amber))" />
                  <Metric label="Focus" value="12.4h" accent="rgb(var(--green))" />
                  <Metric label="Output" value="8.2k" accent="rgb(var(--blue-note))" />
                </div>

                {/* sparkline trend */}
                <div className="rounded-lg border border-border/50 bg-surface/60 px-3 py-3 mb-4">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="label-mono !text-[9px]">deep-work · 14d</span>
                    <span className="font-mono text-[11px] text-green">▲ trending</span>
                  </div>
                  <Sparkline />
                </div>

                {/* terminal line */}
                <div className="rounded-lg border border-border/50 bg-bg/60 px-3 py-2.5 font-mono text-xs">
                  <span className="text-green">$</span>{' '}
                  <span className="text-text/90">run relearn --today</span>
                  <span className="ml-1 inline-block h-3.5 w-1.5 translate-y-0.5 animate-pulse bg-green/80" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
