import React from 'react';
import { m, LazyMotion, domAnimation } from 'framer-motion';

export const Quote = () => (
  <section className="py-32 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-900/50 to-slate-900/70 skew-y-3 scale-110 translate-y-10 z-0" />
    <div className="absolute inset-0">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-brand-500/10 rounded-full blur-[120px]" />
    </div>
    <div className="container mx-auto px-6 relative z-10 text-center">
      <LazyMotion features={domAnimation}>
        <m.blockquote
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto relative"
        >
          <span className="text-7xl md:text-8xl text-brand-500/20 font-serif absolute -top-10 -left-4 md:-left-8">"</span>
          <p className="text-3xl md:text-5xl font-medium text-white leading-tight tracking-tight font-display relative">
            The illiterate of the 21st century will not be those who cannot read and write, but those who cannot <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-400 to-purple-400">learn, unlearn, and relearn.</span>
          </p>
          <footer className="mt-12 text-slate-400 font-semibold tracking-wider uppercase text-sm">
            — Alvin Toffler
          </footer>
        </m.blockquote>
      </LazyMotion>
    </div>
  </section>
);
