import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { cn } from '../lib/utils';

export const ThemeToggle = ({ className }: { className?: string }) => {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const root = document.documentElement;
    setIsDark(root.classList.contains('dark'));
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    if (root.classList.contains('dark')) {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  if (!mounted) {
    return (
      <button
        className={cn(
          "w-8 h-8 flex items-center justify-center rounded-lg border border-border/40 text-muted hover:text-text transition-colors",
          className
        )}
        aria-label="Toggle theme"
      >
        <Sun className="w-4 h-4" />
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      className={cn(
        "w-8 h-8 flex items-center justify-center rounded-lg border border-border/40 text-muted hover:text-text transition-colors",
        className
      )}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
    </button>
  );
};
