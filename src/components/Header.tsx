import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { ThemeToggle } from './ThemeToggle';

// Plain, simple navigation. No code-brackets, no socials (those live in the
// footer) — the top bar is just brand + sections + theme toggle.
const navItems = [
  { name: 'Journal', href: '/journal', match: '/journal' },
  { name: 'Projects', href: '/projects', match: '/projects' },
  { name: 'About', href: '/about', match: '/about' },
];

const NavLink = ({ children, href, active, onClick }: { children: React.ReactNode; href: string; active?: boolean; onClick?: () => void }) => (
  <a
    href={href}
    onClick={onClick}
    className={cn(
      'relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-200',
      active ? 'text-text' : 'text-muted hover:text-text',
    )}
  >
    {children}
    <span
      className={cn(
        'absolute -bottom-0.5 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-green transition-all duration-200',
        active ? 'w-5 opacity-100' : 'w-0 opacity-0',
      )}
    />
  </a>
);

export const Header = ({ currentPath }: { currentPath: string }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeFor = (match: string) => currentPath.includes(match) && match !== '/';

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
        scrolled ? 'bg-bg/80 border-border/50 backdrop-blur-md py-3' : 'bg-transparent border-transparent py-5',
      )}
    >
      <div className="w-full max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5 group">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-text text-bg font-bold text-sm transition-transform group-hover:scale-105">
            R/
          </span>
          <span className="text-sm font-medium text-muted group-hover:text-text transition-colors">
            relearn.ing
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink key={item.href} href={item.href} active={activeFor(item.match)}>
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-muted"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-surface border-b border-border/50 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-2">
              {navItems.map((item) => (
                <NavLink key={item.href} href={item.href} active={activeFor(item.match)} onClick={() => setMobileMenuOpen(false)}>
                  {item.name}
                </NavLink>
              ))}
              <hr className="border-border/50 my-2" />
              <ThemeToggle />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
