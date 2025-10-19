import React, { useState } from 'react';

// --- SVG Icon Components ---

const BrainIcon: React.FC<{ className?: string }> = ({ className = 'h-12 w-12' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.553L16.25 21.75l-.648-1.197a3.375 3.375 0 00-2.456-2.456L12 17.25l1.197-.648a3.375 3.375 0 002.456-2.456L16.25 13.5l.648 1.197a3.375 3.375 0 002.456 2.456L20.25 18l-1.197.648a3.375 3.375 0 00-2.456 2.456z" />
  </svg>
);

const CodeIcon: React.FC<{ className?: string }> = ({ className = 'h-12 w-12' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const AtomIcon: React.FC<{ className?: string }> = ({ className = 'h-12 w-12' }) => (
 <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.73-.664 1.206-.861a7.5 7.5 0 10-9.362 9.362c.198.475.477.89.861 1.206l3.03-2.496m-2.496-3.03c.384-.317.664-.73.861-1.206a7.5 7.5 0 00-9.362-9.362 7.5 7.5 0 009.362 9.362c-.475-.198-.89-.477-1.206-.861zm-2.496 3.03l-2.122 2.122a2.25 2.25 0 003.182 3.182l2.122-2.122" />
</svg>
);


// --- Page Section Components ---

const Header: React.FC<{ setPage: (page: string) => void }> = ({ setPage }) => (
  <header className="sticky top-0 z-50 bg-slate-900/70 backdrop-blur-md">
    <div className="container mx-auto px-6 py-4">
      <div className="flex items-center justify-between">
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); setPage('home'); }} 
          className="text-2xl font-bold text-white tracking-wider cursor-pointer"
        >
          relearn<span className="text-sky-400">.ing</span>
        </a>
        <nav>
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); setPage('blog'); }} 
            className="text-slate-300 hover:text-sky-400 transition-colors duration-300 cursor-pointer"
          >
            Blog
          </a>
        </nav>
      </div>
    </div>
  </header>
);

const Hero: React.FC = () => (
  <section className="relative min-h-[70vh] flex items-center justify-center text-center overflow-hidden">
     <div className="absolute inset-0 bg-grid-slate-700/[0.05] bg-[bottom_1px_center] [mask-image:linear-gradient(to_bottom,transparent,black)]"></div>
    <div className="container mx-auto px-6 z-10">
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-4 tracking-tighter">
        My Personal Journey to
        <br />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-indigo-500">
          Relearning
        </span>.
      </h1>
      <p className="text-lg md:text-xl max-w-3xl mx-auto text-slate-300">
        I felt stuck, weighed down by old habits. This is my public journal to self-advocate—sharing what works, learning from what fails, and ultimately, relearning how to optimize my playbook for life, tech, and AI.
      </p>
    </div>
  </section>
);

const ProblemStatement: React.FC = () => (
  <section id="problem" className="py-20 sm:py-24 bg-slate-900/50">
    <div className="container mx-auto px-6">
       <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white">The Catalyst: A Playbook Full of Bad Habits</h2>
        <p className="text-lg text-slate-400 mt-2 max-w-3xl mx-auto">I was running on outdated software. The friction between my old methods and the modern world was becoming impossible to ignore. Here's what that felt like:</p>
      </div>
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 text-slate-300">
        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
          <h3 className="font-semibold text-white text-lg mb-3">In Life & Work</h3>
          <ul className="list-disc list-inside space-y-2 text-slate-400">
            <li>Mindless scrolling instead of mindful presence.</li>
            <li>Procrastinating on important, long-term goals.</li>
            <li>Reacting emotionally instead of responding thoughtfully.</li>
            <li>Choosing comfort zones over challenging growth.</li>
          </ul>
        </div>
        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
          <h3 className="font-semibold text-white text-lg mb-3">In Tech & AI</h3>
          <ul className="list-disc list-inside space-y-2 text-slate-400">
            <li>Clinging to familiar but inefficient developer tools.</li>
            <li>Writing boilerplate code that could be automated.</li>
            <li>Ignoring the fundamentals of new AI capabilities.</li>
            <li>Fearing new technologies instead of learning to leverage them.</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
);


const featuresData = [
  {
    icon: <BrainIcon className="h-10 w-10 text-sky-400" />,
    title: 'Relearn Life',
    description: "Breaking free from limiting beliefs and old habits. I'm focusing on mindfulness, emotional intelligence, and resilience for a more fulfilling existence.",
  },
  {
    icon: <CodeIcon className="h-10 w-10 text-sky-400" />,
    title: 'Relearn Tech',
    description: 'The digital landscape evolves constantly. My goal is to stay ahead by mastering current technologies and understanding the principles that drive innovation.',
  },
  {
    icon: <AtomIcon className="h-10 w-10 text-sky-400" />,
    title: 'Relearn AI',
    description: "Artificial intelligence is reshaping our world. I'm learning to leverage AI tools ethically and effectively to augment my capabilities, not replace them.",
  },
];

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700 transition-all duration-300 hover:border-sky-500/50 hover:shadow-2xl hover:shadow-sky-500/10 transform hover:-translate-y-2">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </div>
);


const Features: React.FC = () => (
  <section id="features" className="py-20 sm:py-32">
    <div className="container mx-auto px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white">The Three Pillars of My Journey</h2>
        <p className="text-lg text-slate-400 mt-2 max-w-2xl mx-auto">To bring structure to this process, I'm focusing my efforts on these three core areas.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {featuresData.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </div>
  </section>
);

const Quote: React.FC = () => (
    <section className="py-20 sm:py-24 bg-slate-900">
        <div className="container mx-auto px-6 text-center">
            <blockquote className="max-w-4xl mx-auto">
                <p className="text-2xl md:text-3xl font-medium text-slate-200 italic leading-relaxed">
                    "The illiterate of the 21st century will not be those who cannot read and write, but those who cannot learn, unlearn, and relearn."
                </p>
                <cite className="block mt-6 text-slate-400 not-italic">— Alvin Toffler</cite>
            </blockquote>
        </div>
    </section>
);


const CallToAction: React.FC = () => (
  <section className="py-20 sm:py-32">
    <div className="container mx-auto px-6 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Follow The Journey</h2>
      <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
        If this resonates with you, subscribe for updates as I post new entries to my blog. I'll be sharing the lessons, failures, and successes along the way.
      </p>
      <form className="max-w-lg mx-auto flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
        <input 
          type="email" 
          placeholder="your.email@example.com"
          className="w-full px-5 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
          aria-label="Email Address"
          disabled
        />
        <button 
          type="submit"
          className="bg-slate-600 text-slate-400 font-semibold px-8 py-3 rounded-lg w-full sm:w-auto flex-shrink-0 cursor-not-allowed"
          disabled
        >
          Subscribe
        </button>
      </form>
      <p className="text-sm text-slate-500 mt-4">Email subscriptions are coming soon.</p>
    </div>
  </section>
);

const BlogPage: React.FC<{ setPage: (page: string) => void }> = ({ setPage }) => (
  <section className="min-h-[70vh] flex items-center justify-center text-center">
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Blog</h1>
      <p className="text-xl text-sky-400 mb-8">Under Development</p>
      <p className="text-lg max-w-2xl mx-auto text-slate-300 mb-10">
        I'm currently documenting my journey and preparing my first few posts.
        Check back soon to read about my process of unlearning and relearning.
      </p>
      <button
        onClick={() => setPage('home')}
        className="bg-sky-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-sky-500 transition-colors duration-300"
      >
        Return Home
      </button>
    </div>
  </section>
);

const Footer: React.FC = () => (
  <footer className="border-t border-slate-800">
    <div className="container mx-auto px-6 py-8 text-center text-slate-500">
      <p>&copy; {new Date().getFullYear()} relearn.ing. All rights reserved.</p>
      <p className="text-sm mt-1">A personal perspective on growth and adaptation.</p>
    </div>
  </footer>
);


// --- Main App Component ---

export default function App() {
  const [page, setPage] = useState('home');

  return (
    <div className="bg-slate-900 min-h-screen font-sans antialiased">
      <Header setPage={setPage} />
      <main>
        {page === 'home' ? (
          <>
            <Hero />
            <ProblemStatement />
            <Features />
            <Quote />
            <CallToAction />
          </>
        ) : (
          <BlogPage setPage={setPage} />
        )}
      </main>
      <Footer />
    </div>
  );
}
