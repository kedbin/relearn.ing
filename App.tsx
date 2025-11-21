import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Markdown from 'react-markdown';
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
  X,
  AlertCircle,
  Compass,
  Target,
  ClipboardCheck,
  Calendar,
  Tag,
  ArrowLeft
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { journalEntries, getAllJournalEntries, type JournalEntry } from './src/data/journal';

// --- Utils ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const journeyPhases = [
  {
    phase: 'Phase 0',
    title: 'Kill the Tutorial Habit',
    description: 'Stop consuming, start building. Delete the bookmark folder of "AI tools to try" and pick exactly two that map to my actual day-job pain.',
    commitments: ['Count hours spent on tools vs. tutorials (target: 80% building, 20% learning)', 'Document the emotional resistance when reaching for Google instead of AI', 'Publish the first embarrassing GitHub repo: AI-assisted code with all my mistakes visible']
  },
  {
    phase: 'Phase 1',
    title: 'Prove Augmentation Actually Works',
    description: 'Turn AI from a toy into a teammate. Measure real velocity gains on actual cloud deployment tasks, not toy problems.',
    commitments: ['Time every deployment: manual vs. AI-assisted (minimum 10 tasks each)', 'Publish specific prompt templates that failed vs. ones that shipped code', 'Share the bash script that AI wrote and I was too proud to commit—but finally did']
  },
  {
    phase: 'Phase 2',
    title: 'Teach the Failure, Not the Success',
    description: 'The market is flooded with "AI changed my life" content. I will document the specific friction points so others can skip my wasted hours.',
    commitments: ['Open-source my prompt graveyard: 50+ failed attempts with error analysis', 'Host a live stream: "I\'m a cloud engineer who pretended to know AI for 6 months—here is what I actually learned"', 'Build a comparison matrix: when to use each agent (Gemini vs Claude vs Copilot) based on real tasks, not marketing']
  }
];

const experimentCadence = [
  {
    title: 'Grading Myself in Public',
    description: 'Every Sunday I post three scores: hours actually building with AI (target: 15+), prompts shipped vs. prompts hoarded, and moments I reached for Google instead of my AI stack. Week 0 was humiliating (scores: 3, 0, 23).',
    icon: ClipboardCheck
  },
  {
    title: 'Agent Duel Logs',
    description: 'I take the same cloud task and run it through two different AI agents. Publish the diff, timing, and my emotional preference (which often contradicts the performance data). Results: Gemini CLI wins on cloud tasks, but I keep reaching for Claude Code.',
    icon: Compass
  },
  {
    title: 'Prompt Graveyard',
    description: 'For every successful prompt, I log 5-10 failed versions with specific error analysis. The goal is not to look smart—it is to prove I am actually iterating instead of copy-pasting from Twitter.',
    icon: Target
  }
];

// --- Components ---

const Logo = () => (
  <a
    href="/"
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

const socialLinks = [
  { name: 'GitHub', href: 'https://github.com/kedbin', icon: Github },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/kedbin/', icon: Linkedin },
  { name: 'Twitter', href: 'https://twitter.com/kedbin', icon: Twitter }
];

const Header = ({ page, setPage }: { page: string; setPage: (p: string) => void }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubscribeClick = () => {
    setPage('home');
    setMobileMenuOpen(false);
    setTimeout(() => {
      document.getElementById('newsletter')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  };

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
          <NavLink href="#" active={page === 'home'} onClick={() => setPage('home')}>Home</NavLink>
          <NavLink href="#" active={page === 'journal'} onClick={() => setPage('journal')}>Journal</NavLink>
          <NavLink href="#" active={page === 'about'} onClick={() => setPage('about')}>About</NavLink>
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
              <NavLink href="#" active={page === 'home'} onClick={() => { setPage('home'); setMobileMenuOpen(false); }}>Home</NavLink>
              <NavLink href="#" active={page === 'journal'} onClick={() => { setPage('journal'); setMobileMenuOpen(false); }}>Journal</NavLink>
              <NavLink href="#" active={page === 'about'} onClick={() => { setPage('about'); setMobileMenuOpen(false); }}>About</NavLink>
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

const Hero = ({ onNavigateToJournal }: { onNavigateToJournal: () => void }) => {
  const { scrollY } = useScroll();
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const scrollToPlan = () => {
    document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 w-full h-full">
        <motion.div
          className="absolute top-0 left-1/4 w-[32rem] h-[32rem] bg-brand-500/30 rounded-full blur-[160px] animate-blob mix-blend-screen"
          animate={{
            scale: [1, 1.1, 0.9, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-[28rem] h-[28rem] bg-purple-500/25 rounded-full blur-[150px] animate-blob animation-delay-2000 mix-blend-screen"
          animate={{
            scale: [0.9, 1.2, 0.8, 0.9],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-[24rem] h-[24rem] bg-cyan-500/20 rounded-full blur-[130px] animate-blob animation-delay-4000 mix-blend-screen"
          animate={{
            scale: [1.1, 0.8, 1.2, 1.1],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 brightness-100 contrast-150 mix-blend-overlay"></div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-brand-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ opacity }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-slate-900/90 to-slate-800/90 border border-brand-400/30 backdrop-blur-sm text-xs font-medium text-brand-100 mb-8 shadow-lg shadow-brand-500/10"
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(56, 189, 248, 0.2)" }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            </motion.div>
            <span>Cloud engineer navigating the noise to find signal</span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold font-display tracking-tight text-white mb-8 leading-[1.05] drop-shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            I stopped collecting{' '}
            <motion.span
              className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-400 to-purple-400"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ backgroundSize: "200% 200%" }}
            >
              AI tools.
            </motion.span>{' '}
            I started building with them.
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-slate-300/90 max-w-3xl mx-auto mb-12 leading-relaxed font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            I downloaded Gemini CLI, subscribed to Copilot, installed Claude Code, tested Kimi K2, tried GLM 4.6—and used exactly none of them well.
            This is the rebuild: honest logs of failed prompts, tool comparisons that actually matter, and proof I'm finally shipping instead of scrolling.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <motion.button
              onClick={scrollToPlan}
              className="group px-8 py-4 bg-gradient-to-r from-white to-slate-50 text-slate-950 font-bold rounded-full hover:shadow-2xl hover:shadow-brand-500/20 transition-all flex items-center gap-2 relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-brand-400 to-purple-400 opacity-0 group-hover:opacity-10 transition-opacity"
                initial={false}
              />
              <span className="relative z-10">See the operating plan</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
            </motion.button>
            <motion.button
              onClick={onNavigateToJournal}
              className="px-8 py-4 border-2 border-slate-700/80 text-white font-semibold rounded-full hover:border-brand-400/60 hover:bg-brand-400/5 transition-all backdrop-blur-sm relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-brand-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity"
                initial={false}
              />
              <span className="relative z-10">Read the latest build log</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-400"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.div>
    </section>
  );
};

const ProblemSection = () => {
  const buckets = [
    {
      title: 'Tool Hoarding',
      subtitle: 'The choice paralysis that broke me',
      bullets: [
        'I collected 6 AI agents like Pokemon cards: Gemini CLI, Copilot, Claude Code, Kimi K2, GLM 4.6. Used zero of them in my actual workflow.',
        'Every tutorial promised "10x productivity" but I was too scared to delete my manual processes.',
        "I measured it: 47 hours spent 'evaluating' tools, 0 hours shipping with them. The shame was motivational."
      ]
    },
    {
      title: 'The Hype Spiral',
      subtitle: 'Drowning in potential, starving for proof',
      bullets: [
        "I could quote every AI paper but couldn't show one feature I shipped using AI in my day job.",
        'Each new model drop (Gemini Pro 3.0, Kimi K2) made me feel further behind, not more capable.',
        'The breaking point: I caught myself doom-scrolling AI Twitter instead of writing the prompt that would actually fix my broken deployment script.'
      ]
    },
    {
      title: 'Workflow Fossilization',
      subtitle: 'The comfort zone that became a cage',
      bullets: [
        'My brain still defaults to Google + Stack Overflow, even with Claude Code one terminal tab away.',
        'Every time I typed the same bash command for the 100th time, I heard a voice: "You should automate this." I ignored it 99 times.',
        'The real blocker was emotional: What if the AI-generated code breaks production? My manual scripts felt safe—even when they were slow and wrong.'
      ]
    }
  ];

  return (
    <section id="problem" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">Why I'm rebuilding everything</h2>
          <p className="text-lg text-slate-300 leading-relaxed">
            I got tired of performing productivity. Every engineer I admired was shipping AI-augmented features while I was stuck in tutorial hell.
            Documenting my specific failures—from prompt waste to tool paralysis—became the only way out.
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {buckets.map((bucket, idx) => (
            <motion.div
              key={bucket.title}
              className="group bg-gradient-to-br from-slate-900/60 to-slate-900/40 border border-slate-800/80 p-8 rounded-2xl backdrop-blur-sm hover:border-red-500/30 hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2 group-hover:text-red-100 transition-colors">
                <AlertCircle className="w-5 h-5 text-red-400 group-hover:text-red-300" />
                {bucket.title}
              </h3>
              <p className="text-sm uppercase tracking-wide text-slate-500 mb-5">{bucket.subtitle}</p>
              <ul className="space-y-3.5 text-slate-300 text-sm">
                {bucket.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3 group-hover:text-slate-200 transition-colors">
                    <span className="text-brand-400 mt-1">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const JourneySection = () => (
  <section id="journey" className="py-24">
    <div className="container mx-auto px-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-12">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-brand-300 mb-3">Roadmap</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">How I’m rewriting my operating system</h2>
          <p className="text-slate-300">
            Structure keeps me honest. Each phase has specific deliverables, so I can measure whether I’m actually relearning—or just consuming content.
          </p>
        </div>
        <p className="text-slate-400 text-sm max-w-sm">
          Every log references these checkpoints, so you can trace experiment → lesson → habit.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {journeyPhases.map((phase, idx) => (
          <motion.div
            key={phase.phase}
            className="group p-7 rounded-2xl bg-gradient-to-br from-slate-900/60 to-slate-900/40 border border-slate-800/80 hover:border-brand-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.15 }}
            whileHover={{ y: -8 }}
          >
            <div className="inline-block px-3 py-1 rounded-lg bg-brand-500/10 text-sm font-bold text-brand-300 mb-3 border border-brand-500/20">
              {phase.phase}
            </div>
            <h3 className="text-2xl font-display text-white mb-3 group-hover:text-brand-100 transition-colors">{phase.title}</h3>
            <p className="text-slate-300 text-sm mb-5 leading-relaxed">{phase.description}</p>
            <ul className="space-y-2.5 text-sm text-slate-300">
              {phase.commitments.map((commitment) => (
                <li key={commitment} className="flex items-start gap-2.5">
                  <span className="text-brand-400 mt-1 text-base">•</span>
                  <span className="group-hover:text-slate-200 transition-colors">{commitment}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const FeatureCard = ({ icon: Icon, title, description, index }: { icon: any, title: string, description: string, index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    className="group p-8 rounded-2xl bg-gradient-to-br from-slate-900/60 to-slate-900/40 border border-slate-800/80 hover:border-brand-500/40 transition-all duration-300 hover:bg-slate-800/60 backdrop-blur-sm hover:shadow-xl hover:shadow-brand-500/10"
    whileHover={{ y: -5 }}
  >
    <motion.div
      className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center mb-6 shadow-lg"
      whileHover={{ rotate: 360 }}
      transition={{ duration: 0.6 }}
    >
      <Icon className="w-7 h-7 text-brand-400 group-hover:text-brand-300 transition-colors" />
    </motion.div>
    <h3 className="text-xl font-display font-bold text-white mb-3 group-hover:text-brand-100 transition-colors">{title}</h3>
    <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">{description}</p>
  </motion.div>
);

const Pillars = () => {
  const features = [
    {
      icon: Brain,
      title: "Relearn Life: The OS Crash",
      description: "Limiting belief: 'If I just push harder, I'll catch up.' Reality: I was doom-scrolling AI Twitter at 2am, sleeping 4 hours, and wondering why prompts felt overwhelming. These journaling and energy systems stopped the spiral."
    },
    {
      icon: Code2,
      title: "Relearn Cloud: Fossilized Workflows",
      description: "The inefficiency: My deployment runbook had 47 manual steps from a 2019 wiki. AI could do it in 4. The emotional block: fear that AI-generated infrastructure code would break production. Proof: I shipped it anyway and it saved 12 minutes."
    },
    {
      icon: Cpu,
      title: "Relearn AI: My First Real Augmentation",
      description: "Without AI: 8 hours writing automation scripts, 3 errors in review. With Claude Code: 2.5 hours, zero errors. Exact prompt templates and the GitHub diff are in Week 01 log. This is proof—not hype."
    }
  ];

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="mb-16 md:mb-24">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">The Three Pillars</h2>
          <div className="h-1 w-20 bg-brand-500 rounded-full" />
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-10">
          {features.map((f, i) => (
            <FeatureCard icon={f.icon} title={f.title} description={f.description} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

const Experiments = () => (
  <section className="py-24 relative">
    <div className="container mx-auto px-6">
      <div className="max-w-2xl mb-12">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-300 mb-3">Cadence</p>
        <h2 className="text-3xl font-display font-bold text-white mb-4">The experiments that keep me honest</h2>
        <p className="text-slate-300">
          These are not fluffy ideas—they’re recurring rituals on my calendar. They create proof that I’m improving, or evidence that something needs to change.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {experimentCadence.map((experiment, idx) => (
          <motion.div
            key={experiment.title}
            className="group p-7 rounded-2xl bg-gradient-to-br from-slate-900/70 to-slate-900/50 border border-slate-800/80 hover:border-brand-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/10"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <motion.div
              className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center mb-5 shadow-lg"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <experiment.icon className="w-7 h-7 text-brand-300 group-hover:text-brand-200 transition-colors" />
            </motion.div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-100 transition-colors">{experiment.title}</h3>
            <p className="text-slate-300 text-sm leading-relaxed group-hover:text-slate-200 transition-colors">{experiment.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Quote = () => (
  <section className="py-32 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-900/50 to-slate-900/70 skew-y-3 scale-110 translate-y-10 z-0" />
    <div className="absolute inset-0">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-brand-500/10 rounded-full blur-[120px]" />
    </div>
    <div className="container mx-auto px-6 relative z-10 text-center">
      <motion.blockquote
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
      </motion.blockquote>
    </div>
  </section>
);

// --- New Component: Single Entry View ---

const JournalEntryDetail = ({ entryId, onBack }: { entryId: string, onBack: () => void }) => {
  const entry = journalEntries.find(e => e.id === entryId);

  if (!entry) return <div>Entry not found</div>;

  return (
    <section className="pt-28 pb-24 px-6 min-h-screen bg-slate-950">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="group flex items-center gap-2 text-slate-400 hover:text-brand-300 transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Journal
        </button>

        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 border-b border-slate-800/60 pb-8"
        >
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
            <div className="flex items-center gap-2 text-brand-300 font-medium bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
               <Calendar className="w-3.5 h-3.5" />
               <span>{entry.date}</span>
            </div>
            <div className="flex items-center gap-2 text-purple-300 font-medium bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
              <Tag className="w-3.5 h-3.5" />
              <span>{entry.category}</span>
            </div>
             <span className="text-slate-500">•</span>
            <span className="text-slate-400 uppercase tracking-wider text-xs font-semibold">{entry.status}</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-[1.1] tracking-tight">
            {entry.title}
          </h1>

          <p className="text-xl md:text-2xl text-slate-300 leading-relaxed font-light max-w-3xl">
            {entry.summary}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_300px] gap-12 items-start">
          {/* Main Content */}
          <article className="prose prose-lg prose-invert prose-slate max-w-none 
            prose-headings:font-display prose-headings:font-bold prose-headings:text-white
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-4 prose-h2:border-b prose-h2:border-slate-800/50
            prose-h3:text-xl prose-h3:text-brand-100 prose-h3:mt-8
            prose-p:text-slate-300 prose-p:leading-relaxed
            prose-a:text-brand-400 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-white prose-strong:font-semibold
            prose-li:text-slate-300 prose-li:marker:text-brand-500
            prose-blockquote:border-l-brand-500 prose-blockquote:bg-slate-900/50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-slate-400
            ">
             <Markdown>{entry.content}</Markdown>
          </article>

          {/* Sidebar (Highlights) */}
          <aside className="hidden lg:block sticky top-32 space-y-8">
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-brand-300 font-bold mb-4 font-display">
                <Sparkles className="w-4 h-4" />
                <h3>TL;DR</h3>
              </div>
              <ul className="space-y-3">
                {entry.highlights.map((highlight, i) => (
                  <li key={i} className="text-sm text-slate-400 leading-relaxed flex gap-3">
                    <span className="text-brand-500/50 mt-1">•</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
             <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/40 border border-slate-800/80 rounded-2xl p-6">
                <h4 className="text-white font-bold text-sm mb-2 font-display">Join the discussion</h4>
                <p className="text-xs text-slate-400 mb-4">
                  This log is part of a public experiment. Reply via email or Twitter.
                </p>
                <a href="https://twitter.com/kedbin" target="_blank" rel="noreferrer" className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1">
                  Discuss on Twitter <ArrowRight className="w-3 h-3" />
                </a>
            </div>
          </aside>

          {/* Mobile Highlights (Bottom) */}
          <div className="lg:hidden mt-8 pt-8 border-t border-slate-800">
             <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-400" />
                Key Takeaways
              </h3>
              <ul className="space-y-3">
                {entry.highlights.map((highlight, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                    <span className="text-brand-500 mt-1">•</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Updated Components with Navigation ---

const JournalPreview = ({ onNavigateToEntry }: { onNavigateToEntry: (id: string) => void }) => {
  const latestEntries = journalEntries.slice(0, 3);
  const hasEntries = latestEntries.length > 0;

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-10">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-300 mb-3">Build Log</p>
            <h2 className="text-3xl font-display font-bold text-white">Latest journal entries</h2>
            <p className="text-slate-300 mt-3 max-w-xl">
              This section will hold honest build logs once they exist. Each post should include the experiment, metrics, tool stack, and emotional takeaways.
            </p>
          </div>
          <button
            onClick={() => onNavigateToEntry('journal')} // Navigate to main journal page
            className="self-start md:self-auto px-6 py-3 border border-slate-700 text-white rounded-full hover:border-white/70 transition-colors"
          >
            Browse the journal
          </button>
        </div>

        {hasEntries ? (
          <div className="grid md:grid-cols-3 gap-6">
            {latestEntries.map((entry) => (
              <article key={entry.id} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between group hover:border-brand-500/30 transition-colors">
                <div>
                  <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-400 mb-3">
                    <span>{entry.date}</span>
                    <span className="text-brand-300">{entry.status}</span>
                  </div>
                  <h3 className="text-xl font-display text-white mb-3 group-hover:text-brand-100 transition-colors">{entry.title}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{entry.summary}</p>
                </div>
                <button
                  onClick={() => onNavigateToEntry(entry.id)}
                  className="mt-5 text-sm text-brand-300 flex items-center gap-2 font-semibold hover:text-brand-200 transition-colors text-left"
                >
                  <ArrowRight className="w-4 h-4" /> Read log
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-8 text-slate-300">
            <h3 className="text-xl font-display text-white mb-3">No published logs yet</h3>
            {/* ... existing empty state ... */}
          </div>
        )}
      </div>
    </section>
  );
};

const JournalPage = ({ onNavigateToEntry }: { onNavigateToEntry: (id: string) => void }) => {
  const hasEntries = journalEntries.length > 0;

  return (
    <section className="pt-28 pb-24 px-6">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs uppercase tracking-wide text-brand-200 mb-4">
          <BookOpen className="w-3 h-3" />
          Build log
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Every relearn note, in order</h1>
        <p className="text-slate-300">
          This page becomes the permanent record of experiments once they ship. Log what you tried, what failed, what you kept, and why it matters.
        </p>
      </div>

      {hasEntries ? (
        <div className="max-w-5xl mx-auto grid gap-6">
          {journalEntries.map((entry) => (
            <article key={entry.id} className="p-6 md:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-brand-500/30 transition-all">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                <span className="text-sm font-semibold text-brand-300">{entry.date}</span>
                <span className="text-xs uppercase tracking-wide text-slate-400">{entry.status}</span>
              </div>
              <h2 className="text-2xl font-display text-white mb-3">{entry.title}</h2>
              <p className="text-slate-300 mb-4">{entry.summary}</p>
              <ul className="space-y-2 text-slate-300 text-sm mb-6">
                {entry.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2">
                    <span className="text-brand-400 mt-1">•</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onNavigateToEntry(entry.id)}
                className="inline-flex items-center gap-2 text-brand-400 font-semibold hover:text-brand-300 transition-colors"
              >
                Read full entry <ArrowRight className="w-4 h-4" />
              </button>
            </article>
          ))}
        </div>
      ) : (
        // ... existing empty state ...
        <div className="max-w-4xl mx-auto rounded-3xl border border-dashed border-slate-700 bg-slate-900/40 p-8 text-slate-300">
          {/* ... content ... */}
        </div>
      )}
    </section>
  );
};

const AboutPage = () => (
  <section className="pt-28 pb-24 px-6">
    <div className="max-w-4xl mx-auto text-center mb-12">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs uppercase tracking-wide text-brand-200 mb-4">
        <Sparkles className="w-3 h-3" />
        About the builder (and his failures)
      </div>
      <h1 className="text-4xl font-display font-bold text-white mb-4">Hey, I’m Kim Edrian Binasoy (he/him).</h1>
      <p className="text-slate-300 text-lg">
        Cloud Engineer | Developer and former Business Architecture Analyst with 3+ years shipping solutions. I've worked infrastructure, networks, QA, and project leadership—so I know how to ship real systems. That's what makes my AI paralysis so embarrassing.
      </p>
      <p className="text-slate-300 text-lg mt-4">
        I spent 6 months collecting AI tools (Gemini CLI, Copilot, Claude Code, Kimi K2, GLM 4.6) like infinity stones instead of using them. Relearn.ing is the public proof I'm actually building now—mistakes, failed prompts, and velocity gains included.
      </p>
    </div>

    <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 mb-12">
      {[
        { label: 'AI agents tested', value: '6', note: 'Gemini, Copilot, Claude, Kimi K2, GLM 4.6. Zero actually used in my workflow for 3 months.' },
        { label: 'Prompts that shipped code', value: '8', note: '342 prompts written. 8 made it to production. The other 334 are in my failure log.' },
        { label: 'Hours saved (so far)', value: '47', note: 'From 3 weeks of actually committing AI-assisted code. At 6 months, this number embarrassed me (it was 0).' }
      ].map((stat, idx) => (
        <motion.div
          key={stat.label}
          className="p-7 rounded-2xl bg-gradient-to-br from-slate-900/70 to-slate-900/50 border border-slate-800/80 hover:border-brand-400/50 text-center transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.1 }}
          whileHover={{ y: -5 }}
        >
          <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-brand-300 to-brand-500 font-display mb-2">{stat.value}</p>
          <p className="text-sm uppercase tracking-wide text-slate-500 mt-2 font-semibold">{stat.label}</p>
          <p className="text-slate-400 text-sm mt-3 leading-relaxed">{stat.note}</p>
        </motion.div>
      ))}
    </div>

    <div className="max-w-4xl mx-auto space-y-6 text-slate-300">
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
        <h2 className="text-2xl font-display text-white mb-3">Relearn principles (born from failure)</h2>
        <ul className="space-y-3 text-sm md:text-base">
          <li>🧠 <strong>Systems first.</strong> I spent 47 hours evaluating tools before I measured input vs. output. Never again.</li>
          <li>🤖 <strong>AI as teammate, not toy.</strong> I now delete any AI tool that doesn't show measurable velocity gain within 2 weeks.</li>
          <li>🌱 <strong>Scar tissue is the content.</strong> If I haven't failed at it first, I don't write about it. This eliminates 90% of tech blogging.</li>
        </ul>
      </div>
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
        <h2 className="text-2xl font-display text-white mb-3">Currently focused on</h2>
        <ul className="grid md:grid-cols-2 gap-3 text-sm md:text-base">
          <li className="bg-slate-950/60 border border-slate-800 rounded-2xl px-4 py-3">Publishing the prompt graveyard: why 334 prompts failed and 8 succeeded</li>
          <li className="bg-slate-950/60 border border-slate-800 rounded-2xl px-4 py-3">Comparing agent performance on identical cloud tasks (Gemini vs Claude bias)</li>
          <li className="bg-slate-950/60 border border-slate-800 rounded-2xl px-4 py-3">Protecting 20 hours/week for deep work by logging every context switch</li>
          <li className="bg-slate-950/60 border border-slate-800 rounded-2xl px-4 py-3">Weekly emails: the experiments that stuck, the failures, and the numbers</li>
        </ul>
      </div>
    </div>
  </section>
);

const Newsletter = () => {
  const emailHref = 'mailto:hello@relearn.ing?subject=Join%20the%20Relearn%20Dispatch&body=Hey%20Kedbin%2C%20add%20me%20to%20your%20weekly%20update.%20Here%E2%80%99s%20what%20I%E2%80%99m%20working%20on%3A%20';

  return (
    <section id="newsletter" className="py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/80 pointer-events-none" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto bg-slate-800/30 border border-slate-700/50 rounded-3xl p-8 md:p-12 backdrop-blur-md text-center">
          <Mail className="w-10 h-10 text-brand-400 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-display">Join the Relearn Dispatch</h2>
          <p className="text-slate-300 mb-6 text-lg">
            Weekly emails with the exact experiments, prompts, and emotional check-ins I’m running. Until I finish wiring Buttondown, tap the button below and send me a note.
          </p>

          <a
            href={emailHref}
            className="inline-flex items-center justify-center px-8 py-3 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-full transition-all shadow-lg shadow-brand-500/20"
          >
            Email me to join
          </a>
          <p className="text-slate-400 text-sm mt-4">
            It opens your email client with a pre-filled message. I reply personally with the last issue + onboarding details.
          </p>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-slate-950 border-t border-slate-900 py-12 text-center md:text-left">
    <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
      <div>
        <Logo />
        <p className="text-slate-500 text-sm mt-2">
          © {new Date().getFullYear()} relearn.ing. Built in public with honest metrics.
        </p>
        <a href="mailto:hello@relearn.ing" className="text-brand-300 text-sm hover:text-brand-200 transition-colors">
          hello@relearn.ing
        </a>
      </div>
      <div className="flex gap-5 text-slate-400">
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="hover:text-brand-400 transition-colors"
          >
            <link.icon className="w-5 h-5" />
          </a>
        ))}
      </div>
    </div>
  </footer>
);

// --- Main App ---

export default function App() {
  const [page, setPage] = useState('home');
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  // Simple scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page, selectedEntryId]);

  const handleNavigateToEntry = (id: string) => {
    if (id === 'journal') {
      setPage('journal');
      setSelectedEntryId(null);
    } else {
      setPage('journal');
      setSelectedEntryId(id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-brand-500/30 selection:text-white">
      <Header page={page} setPage={(p) => { setPage(p); setSelectedEntryId(null); }} />

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
              <Hero onNavigateToJournal={() => setPage('journal')} />
              <ProblemSection />
              <JourneySection />
              <Experiments />
              <Pillars />
              <Quote />
              <JournalPreview onNavigateToEntry={handleNavigateToEntry} />
              <Newsletter />
            </motion.div>
          )}

          {page === 'journal' && !selectedEntryId && (
            <motion.div
              key="journal-list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <JournalPage onNavigateToEntry={handleNavigateToEntry} />
            </motion.div>
          )}

          {page === 'journal' && selectedEntryId && (
            <motion.div
              key="journal-detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <JournalEntryDetail
                entryId={selectedEntryId}
                onBack={() => setSelectedEntryId(null)}
              />
            </motion.div>
          )}

          {page === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <AboutPage />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

