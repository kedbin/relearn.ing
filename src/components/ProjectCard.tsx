import React from 'react';
import { ArrowUpRight, Github, ArrowRight } from 'lucide-react';
import { NotebookCard } from './ui/NotebookCard';
import { Tag } from './ui/Tag';
import { Motif } from './ui/Motif';

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
        <div className="grid lg:grid-cols-[1fr_1fr] gap-8 rounded-2xl border border-border/60 bg-surface/40 p-6 md:p-8 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-text/25 group-hover:shadow-[0_24px_50px_-24px_rgba(0,0,0,0.8)]">
          <div className="flex flex-col justify-center">
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
              {techStack.map((tech) => (
                <Tag key={tech}>{tech}</Tag>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted font-mono">{date}</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-text text-bg px-4 py-1.5 text-xs font-semibold transition-all group-hover:gap-2.5">
                Read case study <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
          <div className="h-48 md:h-64 overflow-hidden rounded-xl">
            <Motif seed={id} category="Relearn Engineering" className="h-full w-full transition-transform duration-500 group-hover:scale-[1.03]" />
          </div>
        </div>
      </a>
    );
  }

  return (
    <div className="group relative h-full">
      <NotebookCard className="h-full flex flex-col transition-all duration-300 group-hover:border-text/20">
        {/* Thumbnail */}
        <div className="mb-4 h-40">
          <Motif seed={id} category="Relearn Engineering" className="h-full w-full" />
        </div>

        {/* Date */}
        <span className="label-mono block mb-3">{date}</span>

        {/* Title & Description */}
        <h3 className="card-title text-xl text-text mb-2 group-hover:text-note transition-colors">
          {title}
        </h3>
        <p className="text-muted text-sm leading-relaxed mb-4 line-clamp-3">
          {description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {techStack.slice(0, 4).map((tech) => (
            <Tag key={tech}>{tech}</Tag>
          ))}
        </div>

        {/* Links — elevated above the full-card overlay so they stay clickable */}
        <div className="relative z-10 flex items-center gap-4 pt-4 border-t border-border/30 mt-auto">
          <span className="text-xs text-note flex items-center gap-1">
            Read case study <ArrowRight className="w-3 h-3" />
          </span>
          {repoUrl && (
            <a href={repoUrl} target="_blank" rel="noreferrer" className="text-xs text-muted hover:text-text transition-colors flex items-center gap-1">
              <Github className="w-3 h-3" /> Source
            </a>
          )}
          {demoUrl && (
            <a href={demoUrl} target="_blank" rel="noreferrer" className="text-xs text-muted hover:text-text transition-colors flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> Live
            </a>
          )}
        </div>
      </NotebookCard>

      {/* Full-card stretched link. Sits over the card so the whole surface is
          clickable; the external links above stay reachable via z-10. Kept as
          a sibling (not a wrapper) to avoid nesting <a> inside <a>. */}
      <a
        href={`/projects/${id}`}
        className="absolute inset-0 z-0 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-green/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        aria-label={`Read case study: ${title}`}
      />
    </div>
  );
};
