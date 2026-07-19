import React from 'react';
import { ArrowRight, Github, ArrowUpRight } from 'lucide-react';
import { NotebookCard } from './ui/NotebookCard';
import { Tag } from './ui/Tag';

interface ProjectCardProps {
  title: string;
  description: string;
  date: string;
  techStack: string[];
  demoUrl?: string;
  repoUrl?: string;
  id: string;
  featured?: boolean;
}

export const ProjectCard = ({ title, description, date, techStack, demoUrl, repoUrl, id, featured = false }: ProjectCardProps) => {
  if (featured) {
    return (
      <a
        href={`/projects/${id}`}
        className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-green/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-2xl"
      >
        <NotebookCard className="h-full flex flex-col transition-transform duration-300 group-hover:-translate-y-1">
          <div className="flex flex-col justify-center flex-grow">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-green">
                <span className="w-1.5 h-1.5 rounded-full bg-green" />
                Featured Project
              </span>
            </div>
            <h3 className="card-title text-2xl md:text-3xl text-text mb-3 group-hover:text-note transition-colors">
              {title}
            </h3>
            <p className="text-muted leading-relaxed mb-6">
              {description}
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {techStack.slice(0, 4).map((tech) => (
                <Tag key={tech}>{tech}</Tag>
              ))}
            </div>
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/30">
              <span className="text-xs text-muted font-mono">{date}</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-text text-bg px-4 py-1.5 text-xs font-semibold transition-all group-hover:gap-2.5">
                Read case study <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </NotebookCard>
      </a>
    );
  }

  // Non-featured: text-led, whole card clickable, external links stay reachable.
  return (
    <div className="group relative h-full">
      <NotebookCard className="h-full flex flex-col">
        <span className="label-mono block mb-3">{date}</span>
        <h3 className="card-title text-xl text-text mb-2 group-hover:text-note transition-colors">
          {title}
        </h3>
        <p className="text-muted text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
          {description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {techStack.slice(0, 3).map((tech) => (
            <Tag key={tech}>{tech}</Tag>
          ))}
        </div>
        <div className="relative z-10 flex items-center gap-3 pt-3 border-t border-border/30">
          <span className="text-xs text-note font-medium flex items-center gap-1">
            Read case study <ArrowRight className="w-3 h-3" />
          </span>
          {repoUrl && (
            <a href={repoUrl} target="_blank" rel="noreferrer" aria-label="Source code" title="Source" className="ml-auto text-muted hover:text-text transition-colors">
              <Github className="w-4 h-4" />
            </a>
          )}
          {demoUrl && (
            <a href={demoUrl} target="_blank" rel="noreferrer" aria-label="Live demo" title="Live" className="text-muted hover:text-text transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </a>
          )}
        </div>
      </NotebookCard>
      <a
        href={`/projects/${id}`}
        className="absolute inset-0 z-0 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-green/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        aria-label={`Read case study: ${title}`}
      />
    </div>
  );
};
