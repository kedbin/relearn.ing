import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Brain, 
  Code2, 
  Cpu, 
  ArrowRight, 
  Mail, 
  Github, 
  Twitter, 
  Linkedin, 
  ChevronDown,
  Sparkles,
  Zap,
  BookOpen,
  Menu,
  X
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utils ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Logo = () => (
  <a 
    href="#" 
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

const NavLink = ({ children, href, active, onClick }: { children: React.ReactNode; href: string; active?: boolean; onClick?: () => void }) => (
  <a
    href={href}
    onClick={(e) => { e.preventDefault(); onClick?.(); }}
    className={cn(
      "text-sm font-medium transition-colors duration-200 hover:text-brand-300 relative px-3 py-2 rounded-md",
      active ? "text-brand-400 bg-brand-500/10" : "text-slate-400"
    )}
  >
    {children}
  </a>
);

const Header = ({ page, setPage }: { page: string; setPage: (p: string) => void }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        scrolled ? "bg-slate-950/80 backdrop-blur-md border-slate-800/50 py-3" : "bg-transparent border-transparent py-5"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div onClick={() => setPage('home')} className="cursor-pointer">
          <Logo />
        </div>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink href="#" active={page === 'home'} onClick={() => setPage('home')}>Journal</NavLink>
          <NavLink href="#" active={page === 'blog'} onClick={() => setPage('blog')}>Articles</NavLink>
          <NavLink href="#" active={page === 'about'} onClick={() => setPage('about')}>About</NavLink>
        </nav>

        <div className="hidden md:flex items-center gap-4">
            <button className="text-slate-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
            </button>
             <button className="text-slate-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
            </button>
            <button 
                onClick={() => setPage('subscribe')}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold rounded-full transition-all shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40"
            >
                Subscribe
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
              <NavLink href="#" active={page === 'home'} onClick={() => { setPage('home'); setMobileMenuOpen(false); }}>Journal</NavLink>
              <NavLink href="#" active={page === 'blog'} onClick={() => { setPage('blog'); setMobileMenuOpen(false); }}>Articles</NavLink>
              <NavLink href="#" active={page === 'about'} onClick={() => { setPage('about'); setMobileMenuOpen(false); }}>About</NavLink>
              <hr className="border-slate-800" />
              <button className="w-full py-3 bg-brand-600 text-white rounded-lg font-semibold">Subscribe</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-[128px] animate-blob mix-blend-screen" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px] animate-blob animation-delay-2000 mix-blend-screen" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px] animate-blob animation-delay-4000 mix-blend-screen" />
      </div>

      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm text-xs font-medium text-brand-300 mb-8">
            <Sparkles className="w-3 h-3" />
            <span>Writing the new playbook</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-display tracking-tight text-white mb-8 leading-[1.1]">
            My Journey to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-400 to-purple-400">
              Relearn Everything.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            The world is changing faster than ever. I felt stuck in old patterns. 
            This is my public log of unlearning the obsolete and mastering the new—in 
            <span className="text-slate-200 font-semibold"> life</span>, 
            <span className="text-slate-200 font-semibold"> tech</span>, and 
            <span className="text-slate-200 font-semibold"> AI</span>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-8 py-4 bg-white text-slate-950 font-bold rounded-full hover:bg-slate-200 transition-colors flex items-center gap-2">
              Start Reading <ArrowRight className="w-4 h-4" />
            </button>
            <button className="px-8 py-4 bg-slate-800/50 text-white font-semibold rounded-full border border-slate-700 hover:bg-slate-800 transition-colors backdrop-blur-sm">
              View The Stack
            </button>
          </div>
        </motion.div>
      </div>

      <motion.div 
        style={{ y: y2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-500 animate-bounce"
      >
        <ChevronDown className="w-6 h-6" />
      </motion.div>
    </section>
  );
};

const FeatureCard = ({ icon: Icon, title, description, index }: { icon: any, title: string, description: string, index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    className="group p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-brand-500/30 transition-all duration-300 hover:bg-slate-800/50 backdrop-blur-sm"
  >
    <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:bg-brand-500/20">
      <Icon className="w-6 h-6 text-slate-400 group-hover:text-brand-400 transition-colors" />
    </div>
    <h3 className="text-xl font-display font-bold text-white mb-3">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{description}</p>
  </motion.div>
);

const Pillars = () => {
  const features = [
    {
      icon: Brain,
      title: "Relearn Life",
      description: "Discarding limiting beliefs. Optimizing for mindfulness, resilience, and emotional intelligence in a high-noise world."
    },
    {
      icon: Code2,
      title: "Relearn Tech",
      description: "Moving beyond legacy code and habits. Embracing modern stacks, automation, and the principles of next-gen engineering."
    },
    {
      icon: Cpu,
      title: "Relearn AI",
      description: "From fear to mastery. leveraging artificial intelligence not just as a tool, but as a partner in creativity and problem-solving."
    }
  ];

  return (
    <section className="py-32 relative">
      <div className="container mx-auto px-6">
        <div className="mb-16 md:mb-24">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">The Three Pillars</h2>
          <div className="h-1 w-20 bg-brand-500 rounded-full" />
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 lg:gap-10">
          {features.map((f, i) => (
            <FeatureCard key={i} {...f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

const Quote = () => (
  <section className="py-32 relative overflow-hidden">
    <div className="absolute inset-0 bg-slate-900/50 skew-y-3 scale-110 translate-y-10 z-0" />
    <div className="container mx-auto px-6 relative z-10 text-center">
      <motion.blockquote 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto"
      >
        <span className="text-6xl text-brand-500/20 font-serif absolute -top-8 -left-8">"</span>
        <p className="text-3xl md:text-5xl font-medium text-white leading-tight tracking-tight font-display">
          The illiterate of the 21st century will not be those who cannot read and write, but those who cannot <span className="text-brand-400">learn, unlearn, and relearn.</span>
        </p>
        <footer className="mt-10 text-slate-400 font-medium tracking-wide uppercase text-sm">
          — Alvin Toffler
        </footer>
      </motion.blockquote>
    </div>
  </section>
);

const BlogPlaceholder = ({ setPage }: { setPage: (p: string) => void }) => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 pt-32">
    <BookOpen className="w-16 h-16 text-brand-500 mb-6 opacity-50" />
    <h2 className="text-3xl font-bold text-white mb-4">The Archives Are Opening Soon</h2>
    <p className="text-slate-400 max-w-md mx-auto mb-8">
      I'm currently migrating my notes and draft posts to this new platform. 
      Expect deep dives into AI workflows and personal productivity.
    </p>
    <button 
      onClick={() => setPage('home')}
      className="text-brand-400 hover:text-brand-300 font-medium flex items-center gap-2"
    >
      <ArrowRight className="rotate-180 w-4 h-4" /> Back Home
    </button>
  </div>
);

const Newsletter = () => (
  <section className="py-32 relative">
     <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/80 pointer-events-none" />
    <div className="container mx-auto px-6 relative z-10">
      <div className="max-w-3xl mx-auto bg-slate-800/30 border border-slate-700/50 rounded-3xl p-8 md:p-12 backdrop-blur-md text-center">
        <Mail className="w-10 h-10 text-brand-400 mx-auto mb-6" />
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-display">Join the Inner Circle</h2>
        <p className="text-slate-400 mb-8 text-lg">
          Get notified when I publish new breakdowns on tech, AI, and life optimization. 
          No spam, just signal.
        </p>
        
        <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="flex-1 px-5 py-3 bg-slate-950/50 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-white placeholder:text-slate-600"
          />
          <button className="px-8 py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-500/20">
            Subscribe
          </button>
        </form>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-slate-950 border-t border-slate-900 py-12 text-center md:text-left">
    <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
      <div>
        <Logo />
        <p className="text-slate-500 text-sm mt-2">
          © {new Date().getFullYear()} relearn.ing. Built in public.
        </p>
      </div>
      <div className="flex gap-6 text-slate-400">
        <a href="#" className="hover:text-brand-400 transition-colors"><Github className="w-5 h-5" /></a>
        <a href="#" className="hover:text-brand-400 transition-colors"><Twitter className="w-5 h-5" /></a>
        <a href="#" className="hover:text-brand-400 transition-colors"><Linkedin className="w-5 h-5" /></a>
      </div>
    </div>
  </footer>
);

// --- Main App ---

export default function App() {
  const [page, setPage] = useState('home');

  // Simple scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-brand-500/30 selection:text-white">
      <Header page={page} setPage={setPage} />
      
      <main className="relative">
        <AnimatePresence mode="wait">
          {page === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Hero />
              <Pillars />
              <Quote />
              <Newsletter />
            </motion.div>
          )}
          
          {(page === 'blog' || page === 'about') && (
            <motion.div 
              key="blog"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <BlogPlaceholder setPage={setPage} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}