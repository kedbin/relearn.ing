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
  X,
  AlertCircle,
  Compass,
  Target,
  ClipboardCheck
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utils ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const journalEntries = [
  {
    id: 'week-00-systems-audit',
    title: 'Week 00 · Systems Audit',
    date: 'Nov 17, 2025',
    summary: 'Mapped every ritual, tool, and cloud runbook that currently eats time so I know exactly what to rebuild.',
    highlights: [
      'Tagged 23 daily SOPs as automate, delegate, or drop.',
      'Measured how much calendar space shallow work steals (62%).',
      'Documented the emotional triggers that push me back into autopilot.'
    ],
    status: 'Published'
  },
  {
    id: 'week-01-cloud-to-ai',
    title: 'Week 01 · Cloud → AI Bridge',
    date: 'Nov 24, 2025',
    summary: 'Paired my entry-level cloud skills with AI copilots to rebuild deployment checklists and remove copy/paste toil.',
    highlights: [
      'Rebuilt the AWS incident runbook with GPT-generated decision trees.',
      'Recorded a daily "pairing with AI" log to track prompts that work.',
      'Automated credential rotation reminders with a tiny Lambda + Bedrock call.'
    ],
    status: 'Published'
  },
  {
    id: 'week-02-energy-reset',
    title: 'Week 02 · Energy & Focus Reset',
    date: 'Dec 1, 2025',
    summary: 'Because tools do not matter if my baseline energy is trash, I rebuilt my morning stack, reflection loop, and review cadence.',
    highlights: [
      'Morning systems checkpoint (breathwork, journal, backlog triage).',
      'End-of-day scorecard grading focus, context switches, and experiments.',
      'Codified boundaries for doom-scrolling and late-night tweaking.'
    ],
    status: 'In Progress'
  }
];

const journeyPhases = [
  {
    phase: 'Phase 0',
    title: 'Stabilize the Baseline',
    description: 'Audit how I work today, surface energy leaks, and delete outdated SOPs before layering more tools on top.',
    commitments: ['Systems audit & habit tracker', 'Weekly retro to grade experiments', 'Publish honest metrics, even if embarrassing']
  },
  {
    phase: 'Phase 1',
    title: 'Bridge Cloud → AI',
    description: 'Translate day-job cloud problems into AI playgrounds so I can ship faster, not just consume tutorials.',
    commitments: ['Pair every deployment task with an AI copilot', 'Rewrite runbooks with prompt libraries', 'Share templates + context publicly']
  },
  {
    phase: 'Phase 2',
    title: 'Compound & Teach',
    description: 'Turn the experiments into artifacts—posts, checklists, and walkthroughs others can reuse when they feel stuck like I did.',
    commitments: ['Ship a weekly build log', 'Open-source the SOP library', 'Host small office hours for other jr/mid engineers']
  }
];

const experimentCadence = [
  {
    title: 'Weekly Systems Review',
    description: 'Every Sunday night I grade last week on focus, learning, and delivery, then choose exactly two experiments for the next sprint.',
    icon: ClipboardCheck
  },
  {
    title: 'Cloud to AI Bridge Log',
    description: 'Documenting how I pair AWS/GCP work with GPT-4, Claude, and local models—what prompts, guardrails, and automations actually stick.',
    icon: Compass
  },
  {
    title: 'Public Build Transparency',
    description: 'Posting the messy data: sleep, context switches, deploys, failed prompts. Authenticity > highlight reels.',
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

  const scrollToPlan = () => {
    document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-0 left-1/4 w-[28rem] h-[28rem] bg-brand-500/25 rounded-full blur-[140px] animate-blob mix-blend-screen" />
        <div className="absolute top-1/3 right-1/4 w-[26rem] h-[26rem] bg-purple-500/20 rounded-full blur-[140px] animate-blob animation-delay-2000 mix-blend-screen" />
      </div>

      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-15 brightness-100 contrast-150 mix-blend-overlay"></div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/70 border border-slate-700/60 backdrop-blur-sm text-xs font-medium text-brand-200 mb-8">
            <Sparkles className="w-3 h-3" />
            <span>Entry → mid cloud engineer relearning AI in public</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-display tracking-tight text-white mb-8 leading-[1.1]">
            Relearning my <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-200 via-brand-400 to-purple-400">operating manual</span> for cloud & AI.
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            I’m a junior-to-mid cloud engineer who realized my SOPs were fossilized, my focus was fried, and AI was passing me by.
            This site is the unfiltered rebuild—habits, tooling, prompts, and emotions—so other overwhelmed builders can see the messy middle, not just the highlight reel.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={scrollToPlan}
              className="px-8 py-4 bg-white text-slate-950 font-bold rounded-full hover:bg-slate-100 transition-colors flex items-center gap-2"
            >
              See the operating plan <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={onNavigateToJournal}
              className="px-8 py-4 border border-slate-700 text-white font-semibold rounded-full hover:border-white/70 transition-colors"
            >
              Read the latest build log
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

const ProblemSection = () => {
  const buckets = [
    {
      title: 'Operational Debt',
      subtitle: 'Why I feel ineffective',
      bullets: [
        'My cloud runbooks were written for an old team, not for AI-assisted workflows.',
        'Context switching between pager duty, learning, and life left zero deep focus hours.',
        'I defaulted to "reactive firefighter" mode instead of designing better systems.'
      ]
    },
    {
      title: 'Skill Gap Panic',
      subtitle: 'Why AI felt unreachable',
      bullets: [
        'Analysis paralysis from juggling OpenAI, AWS Bedrock, Claude, local models—so I used none of them well.',
        'Too many tutorials, not enough shipping. I couldn’t point to proofs of progress.',
        'Emotional spiral: if I can’t keep up now, how will I ever become the engineer I want to be?'
      ]
    }
  ];

  return (
    <section id="problem" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">Why I’m rebuilding everything</h2>
          <p className="text-lg text-slate-300 leading-relaxed">
            This project exists because I was tired of pretending the overwhelm was temporary. Documenting the broken pieces forces me to fix them—and gives other early-career engineers a mirror.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {buckets.map((bucket) => (
            <div key={bucket.title} className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl backdrop-blur-sm">
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                {bucket.title}
              </h3>
              <p className="text-sm uppercase tracking-wide text-slate-500 mb-4">{bucket.subtitle}</p>
              <ul className="space-y-3 text-slate-300">
                {bucket.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3">
                    <span className="text-brand-400 mt-1">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
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
        {journeyPhases.map((phase) => (
          <div key={phase.phase} className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-brand-500/30 transition-colors">
            <div className="text-sm font-semibold text-brand-300 mb-2">{phase.phase}</div>
            <h3 className="text-2xl font-display text-white mb-3">{phase.title}</h3>
            <p className="text-slate-300 text-sm mb-4">{phase.description}</p>
            <ul className="space-y-2 text-sm text-slate-300">
              {phase.commitments.map((commitment) => (
                <li key={commitment} className="flex items-start gap-2">
                  <span className="text-brand-400 mt-1">•</span>
                  <span>{commitment}</span>
                </li>
              ))}
            </ul>
          </div>
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
      description: "Energy management, journaling, therapy, and breathwork stacks that keep me steady enough to actually learn."
    },
    {
      icon: Code2,
      title: "Relearn Cloud Foundations",
      description: "Documenting every on-call and deployment task, then rebuilding it with infrastructure-as-code, automation, and peer review."
    },
    {
      icon: Cpu,
      title: "Relearn AI",
      description: "Turning copilots into teammates—prompt libraries, guardrails, and workflows that make early-career engineers faster without faking expertise."
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
            <FeatureCard key={i} {...f} index={i} />
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
        {experimentCadence.map((experiment) => (
          <div key={experiment.title} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-5">
              <experiment.icon className="w-6 h-6 text-brand-300" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{experiment.title}</h3>
            <p className="text-slate-300 text-sm leading-relaxed">{experiment.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

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

const JournalPreview = ({ onNavigateToJournal }: { onNavigateToJournal: () => void }) => {
  const latestEntries = journalEntries.slice(0, 3);

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-10">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-300 mb-3">Build Log</p>
            <h2 className="text-3xl font-display font-bold text-white">Latest journal entries</h2>
            <p className="text-slate-300 mt-3 max-w-xl">
              I publish at least one log per week covering systems, tooling, and emotions. The messy details live here, not on social media.
            </p>
          </div>
          <button 
            onClick={onNavigateToJournal}
            className="self-start md:self-auto px-6 py-3 border border-slate-700 text-white rounded-full hover:border-white/70 transition-colors"
          >
            Browse the journal
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {latestEntries.map((entry) => (
            <article key={entry.id} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-400 mb-3">
                  <span>{entry.date}</span>
                  <span className="text-brand-300">{entry.status}</span>
                </div>
                <h3 className="text-xl font-display text-white mb-3">{entry.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{entry.summary}</p>
              </div>
              <div className="mt-5 text-sm text-brand-300 flex items-center gap-2 font-semibold">
                <ArrowRight className="w-4 h-4" /> Read log
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

const JournalPage = () => (
  <section className="pt-28 pb-24 px-6">
    <div className="max-w-3xl mx-auto text-center mb-16">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs uppercase tracking-wide text-brand-200 mb-4">
        <BookOpen className="w-3 h-3" />
        Build log
      </div>
      <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Every relearn note, in order</h1>
      <p className="text-slate-300">
        I log what I tried, what failed, and what I’m keeping. No polished essays—just receipts that I’m actually doing the work.
      </p>
    </div>

    <div className="max-w-5xl mx-auto grid gap-6">
      {journalEntries.map((entry) => (
        <article key={entry.id} className="p-6 md:p-8 rounded-3xl bg-slate-900/70 border border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
            <span className="text-sm font-semibold text-brand-300">{entry.date}</span>
            <span className="text-xs uppercase tracking-wide text-slate-400">{entry.status}</span>
          </div>
          <h2 className="text-2xl font-display text-white mb-3">{entry.title}</h2>
          <p className="text-slate-300 mb-4">{entry.summary}</p>
          <ul className="space-y-2 text-slate-300 text-sm">
            {entry.highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-2">
                <span className="text-brand-400 mt-1">•</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  </section>
);

const AboutPage = () => (
  <section className="pt-28 pb-24 px-6">
    <div className="max-w-4xl mx-auto text-center mb-12">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs uppercase tracking-wide text-brand-200 mb-4">
        <Sparkles className="w-3 h-3" />
        About the builder
      </div>
      <h1 className="text-4xl font-display font-bold text-white mb-4">Hey, I’m Kedbin.</h1>
      <p className="text-slate-300 text-lg">
        Entry-to-mid level cloud engineer. Three years of AWS/GCP deployments, unglamorous on-call shifts, and lots of imposter syndrome.
        I’m using relearn.ing to rebuild the rituals, tooling, and emotional resilience it takes to grow into an AI-native engineer.
      </p>
    </div>

    <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 mb-12">
      {[
        { label: 'Cloud incidents handled', value: '84', note: 'Every one documented + now automated' },
        { label: 'AI pairing sessions logged', value: '37', note: 'Tracking prompts, latency, accuracy' },
        { label: 'Weekly retros completed', value: '21', note: 'Hard data on focus, sleep, deep work' }
      ].map((stat) => (
        <div key={stat.label} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
          <p className="text-4xl font-bold text-white font-display">{stat.value}</p>
          <p className="text-sm uppercase tracking-wide text-slate-500 mt-2">{stat.label}</p>
          <p className="text-slate-400 text-sm mt-2">{stat.note}</p>
        </div>
      ))}
    </div>

    <div className="max-w-4xl mx-auto space-y-6 text-slate-300">
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
        <h2 className="text-2xl font-display text-white mb-3">Guiding principles</h2>
        <ul className="space-y-3 text-sm md:text-base">
          <li>🧠 <strong>Systems first.</strong> Tools are loud; systems are quiet. I measure inputs, not vibes.</li>
          <li>🤖 <strong>AI as a co-worker.</strong> Every week I define one workflow where AI must partner with me or I delete it.</li>
          <li>🌱 <strong>Public accountability.</strong> If I don’t post the log, the experiment didn’t happen.</li>
        </ul>
      </div>
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6">
        <h2 className="text-2xl font-display text-white mb-3">Currently focused on</h2>
        <ul className="grid md:grid-cols-2 gap-3 text-sm md:text-base">
          <li className="bg-slate-950/60 border border-slate-800 rounded-2xl px-4 py-3">Finishing the AI-ready runbook for incident response</li>
          <li className="bg-slate-950/60 border border-slate-800 rounded-2xl px-4 py-3">Shipping one tutorial per month translating cloud tasks → AI prompts</li>
          <li className="bg-slate-950/60 border border-slate-800 rounded-2xl px-4 py-3">Protecting 20 hours of deep work weekly</li>
          <li className="bg-slate-950/60 border border-slate-800 rounded-2xl px-4 py-3">Expanding journal subscribers who want honest progress reports</li>
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
              <Hero onNavigateToJournal={() => setPage('journal')} />
              <ProblemSection />
              <JourneySection />
              <Experiments />
              <Pillars />
              <Quote />
              <JournalPreview onNavigateToJournal={() => setPage('journal')} />
              <Newsletter />
            </motion.div>
          )}

          {page === 'journal' && (
            <motion.div 
              key="journal"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <JournalPage />
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