import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Code2, Cpu } from 'lucide-react';

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

export const Pillars = () => {
  const features = [
    {
      icon: Brain,
      title: "Theory",
      description: "The Bridge. Constraints, Feedback Loops, and Leverage. Using engineering models (Solow-Swan, CAP Theorem) to solve human problems."
    },
    {
      icon: Code2,
      title: "Tech Stack",
      description: "Modernizing legacy infra. Documenting prompts, agents, and architectural decisions to automate the boring stuff."
    },
    {
      icon: Cpu,
      title: "Bio Stack",
      description: "Debugging the 'Human OS'. Optimizing sleep, focus, and decision-making via data and protocols, not willpower."
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
            <FeatureCard key={f.title} icon={f.icon} title={f.title} description={f.description} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};