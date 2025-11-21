import React from 'react';
import { Zap } from 'lucide-react';

export const Logo = () => (
  <a
    href="/relearn.ing/"
    className="text-2xl font-bold tracking-tighter font-display group flex items-center gap-2"
  >
    <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10 group-hover:bg-brand-500/20 transition-colors">
      <Zap className="h-5 w-5 text-brand-400 group-hover:text-brand-300 transition-colors" />
    </div>
    <span className="text-white">
      relearn<span className="text-brand-400">.ing</span>
    </span>
  </a>
);
