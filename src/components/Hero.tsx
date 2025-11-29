import React from 'react';
import { ChevronDown, Sparkles, ArrowRight } from 'lucide-react';

export const Hero = () => {


  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* CSS Animation Background Elements */}
      <div className="absolute inset-0 w-full h-full">
        <div
          className="absolute top-0 left-1/4 w-[32rem] h-[32rem] bg-brand-500/30 rounded-full blur-[160px] animate-blob mix-blend-screen"
        />
        <div
          className="absolute top-1/3 right-1/4 w-[28rem] h-[28rem] bg-purple-500/25 rounded-full blur-[150px] animate-blob mix-blend-screen"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="absolute bottom-1/4 left-1/3 w-[24rem] h-[24rem] bg-cyan-500/20 rounded-full blur-[130px] animate-blob mix-blend-screen"
          style={{ animationDelay: '4s' }}
        />
      </div>

      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 brightness-100 contrast-150 mix-blend-overlay"></div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="opacity-0 animate-fade-in-up">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-slate-900/90 to-slate-800/90 border border-brand-400/30 backdrop-blur-sm text-xs font-medium text-brand-100 mb-8 shadow-lg shadow-brand-500/10 hover:scale-105 transition-transform duration-300"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>v0.1.0-beta // Continuous Integration for the Self</span>
          </div>

          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold font-display tracking-tight text-white mb-8 leading-[1.05] drop-shadow-2xl opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            System Architecture<br />
            for the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-400 to-purple-400">
              Self.
            </span>
          </h1>

          <p
            className="text-lg md:text-xl text-slate-300/90 max-w-3xl mx-auto mb-12 leading-relaxed font-light opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            Relearning how to work and live. Using engineering principles to debug sleep, focus, and decision making.
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.6s' }}
          >
            <a
              href="#journey"
              className="group px-8 py-4 bg-gradient-to-r from-white to-slate-50 text-slate-950 font-bold rounded-full hover:shadow-2xl hover:shadow-brand-500/20 transition-all flex items-center gap-2 relative overflow-hidden hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-brand-400 to-purple-400 opacity-0 group-hover:opacity-10 transition-opacity" />
              <span className="relative z-10">View Architecture</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
            </a>
            <a
              href="/journal"
              className="px-8 py-4 border-2 border-slate-700/80 text-white font-semibold rounded-full hover:border-brand-400/60 hover:bg-brand-400/5 transition-all backdrop-blur-sm relative overflow-hidden group inline-flex items-center justify-center hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-brand-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10">Read Journal</span>
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-400 animate-bounce">
        <ChevronDown className="w-6 h-6" />
      </div>
    </section>
  );
};