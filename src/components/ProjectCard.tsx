import React from 'react';
import { ArrowUpRight, Github, ArrowRight } from 'lucide-react';
import { NotebookCard } from './ui/NotebookCard';
import { Tag } from './ui/Tag';

// Abstract icon placeholder using CSS shapes
const ProjectIcon = ({ seed }: { seed: number }) => {
  const shapes = [
    // Circle with ring
    <div key="1" className="w-10 h-10 rounded-full border-2 border-amber/40 flex items-center justify-center">
      <div className="w-4 h-4 rounded-full bg-amber/20" />
    </div>,
    // Square with dot
    <div key="2" className="w-10 h-10 rounded-lg border-2 border-note/40 flex items-center justify-center">
      <div className="w-3 h-3 rounded-sm bg-note/20" />
    </div>,
    // Diamond
    <div key="3" className="w-8 h-8 rotate-45 border-2 border-green/40 flex items-center justify-center">
      <div className="w-3 h-3 bg-green/20 -rotate-45" />
    </div>,
    // Hexagon-ish
    <div key="4" className="w-10 h-10 rounded-full border-2 border-redsoft/40 flex items-center justify-center">
      <div className="w-2 h-6 bg-redsoft/20 rounded-full" />
    </div>,
  ];
  return shapes[seed % shapes.length];
};

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
        <div className="grid lg:grid-cols-[1fr_1fr] gap-8 rounded-2xl border border-border/60 bg-surface/40 p-6 md:p-8 transition-all duration-300 group-hover:border-text/20">
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-green">
                <span className="w-1.5 h-1.5 rounded-full bg-green" />
                Featured Project
              </span>
            </div>
            <h3 className="display-serif text-2xl md:text-3xl text-text mb-3 group-hover:text-note transition-colors">
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
            <div className="flex items-center gap-4 text-xs text-muted font-mono">
              <span>{date}</span>
              <span className="flex items-center gap-1 text-note group-hover:text-text transition-colors">
                Read case study <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
          <div className="relative h-48 md:h-64 rounded-xl border border-border/40 bg-surface2 overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgb(var(--green)/0.1),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgb(var(--blue-note)/0.08),transparent_50%)]" />
            <ProjectIcon seed={id.charCodeAt(0)} />
          </div>
        </div>
      </a>
    );
  }

  return (
    <div className="group h-full">
      <NotebookCard className="h-full flex flex-col transition-all duration-300 group-hover:border-text/20">
        {/* Icon + Category */}
        <div className="flex items-center gap-3 mb-4">
          <ProjectIcon seed={id.charCodeAt(0)} />
          <span className="label-mono">{date}</span>
        </div>

        {/* Title & Description */}
        <a href={`/projects/${id}`} className="block group-hover:no-underline mb-auto">
          <h3 className="text-xl font-semibold text-text mb-2 group-hover:text-note transition-colors">
            {title}
          </h3>
          <p className="text-muted text-sm leading-relaxed mb-4 line-clamp-3">
            {description}
          </p>
        </a>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {techStack.slice(0, 4).map((tech) => (
            <Tag key={tech}>{tech}</Tag>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center gap-4 pt-4 border-t border-border/30 mt-auto">
          <a
            href={`/projects/${id}`}
            className="text-xs text-note hover:text-text transition-colors flex items-center gap-1"
          >
            Read case study <ArrowRight className="w-3 h-3" />
          </a>
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
    </div>
  );
};
