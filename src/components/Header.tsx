import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Github, Linkedin, Twitter } from 'lucide-react';
import { cn } from '../lib/utils';
import { Logo } from './Logo';

const socialLinks = [
  { name: 'GitHub', href: 'https://github.com/kedbin', icon: Github },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/kedbin/', icon: Linkedin },
  { name: 'Twitter', href: 'https://twitter.com/kedbin', icon: Twitter }
];

const NavLink = ({ children, href, active }: { children: React.ReactNode; href: string; active?: boolean }) => (
  <a
    href={href}
    className={cn(
      "text-sm font-medium transition-colors duration-200 hover:text-brand-300 relative px-3 py-2 rounded-md",
      active ? "text-brand-400 bg-brand-500/10" : "text-slate-400"
    )}
  >
    {children}
  </a>
);

export const Header = ({ currentPath }: { currentPath: string }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Normalize path to handle trailing slashes
  const isActive = (path: string) => {
    if (path === '/' && (currentPath === '/')) return true;
    return currentPath.startsWith(path) && path !== '/';
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubscribeClick = () => {
    setMobileMenuOpen(false);
    // If on home, scroll. If not, nav to home #newsletter
    if (currentPath === '/') {
       document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
       window.location.href = "/#newsletter";
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        scrolled ? "bg-slate-950/80 backdrop-blur-md border-slate-800/50 py-3" : "bg-transparent border-transparent py-5"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="cursor-pointer">
          <Logo />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink href="/" active={currentPath === '/'}>Home</NavLink>
          <NavLink href="/journal" active={currentPath.includes('/journal')}>Journal</NavLink>
          <NavLink href="/about" active={currentPath.includes('/about')}>About</NavLink>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-3 text-slate-400">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                aria-label={link.name}
                className="hover:text-white transition-colors"
              >
                <link.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
          <button
            onClick={handleSubscribeClick}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold rounded-full transition-all shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40"
          >
            Newsletter
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-slate-400"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
            className="md:hidden bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              <NavLink href="/" active={currentPath === '/'}>Home</NavLink>
              <NavLink href="/journal" active={currentPath.includes('/journal')}>Journal</NavLink>
              <NavLink href="/about" active={currentPath.includes('/about')}>About</NavLink>
              <hr className="border-slate-800" />
              <button
                onClick={handleSubscribeClick}
                className="w-full py-3 bg-brand-600 text-white rounded-lg font-semibold"
              >
                Newsletter
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};