import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Sparkles, ArrowRight } from 'lucide-react';

export const Hero = () => {
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
            <span>Applying systems engineering to code and existence</span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold font-display tracking-tight text-white mb-8 leading-[1.05] drop-shadow-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Debugging the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-400 to-purple-400">
              Cloud.
            </span><br />
            Refactoring{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-purple-400 to-brand-400">
              Life.
            </span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-slate-300/90 max-w-3xl mx-auto mb-12 leading-relaxed font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            I used to optimize Cloud Run cold starts while letting my own habits crash. 
            Now, I apply the same rigorous systems thinking to both. 
            This is the log of unlearning inefficiencies in my infrastructure and my biology.
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
            <a
              href="/journal"
              className="px-8 py-4 border-2 border-slate-700/80 text-white font-semibold rounded-full hover:border-brand-400/60 hover:bg-brand-400/5 transition-all backdrop-blur-sm relative overflow-hidden group inline-flex items-center justify-center"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-brand-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity"
                initial={false}
              />
              <span className="relative z-10">Read the latest build log</span>
            </a>
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
