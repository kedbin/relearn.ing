import React from 'react';
import { ArrowUpRight, Github, Code2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface ProjectCardProps {
  title: string;
  description: string;
  date: string;
  techStack: string[];
  demoUrl?: string;
  repoUrl?: string;
  slug: string;
}

export const ProjectCard = ({ title, description, date, techStack, demoUrl, repoUrl, slug }: ProjectCardProps) => {
  return (
    <div className="group relative flex flex-col h-full bg-slate-900/40 border border-slate-800 rounded-2xl p-6 hover:border-brand-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-brand-900/20">
      
      {/* Date & Links Header */}
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs font-mono text-slate-500">{date}</span>
        <div className="flex gap-3 z-10">
          {repoUrl && (
            <a href={repoUrl} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
          )}
          {demoUrl && (
            <a href={demoUrl} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white transition-colors">
              <ArrowUpRight className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>

      {/* Title & Description */}
      <a href={`/projects/${slug}`} className="block group-hover:no-underline mb-auto">
        <h3 className="text-xl font-display font-bold text-white mb-3 group-hover:text-brand-200 transition-colors">
          {title}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          {description}
        </p>
      </a>

      {/* Tech Stack Tags */}
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-800/50">
        {techStack.map((tech) => (
          <span 
            key={tech} 
            className="px-2 py-1 text-[10px] uppercase tracking-wider font-semibold rounded-md bg-slate-800/50 text-slate-400 border border-slate-700/50"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
};
