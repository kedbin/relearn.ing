import React from 'react';
import { ArrowUpRight, Github } from 'lucide-react';
import { NotebookCard } from './ui/NotebookCard';
import { Tag } from './ui/Tag';

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
    <div className="group h-full">
      <NotebookCard className="h-full flex flex-col transition-all duration-300 group-hover:border-text/20">
        {/* Date & Links Header */}
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs font-mono text-muted">{date}</span>
          <div className="flex gap-3 z-10">
            {repoUrl && (
              <a href={repoUrl} target="_blank" rel="noreferrer" className="text-muted hover:text-text transition-colors">
                <Github className="w-4 h-4" />
              </a>
            )}
            {demoUrl && (
              <a href={demoUrl} target="_blank" rel="noreferrer" className="text-muted hover:text-text transition-colors">
                <ArrowUpRight className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Title & Description */}
        <a href={`/projects/${slug}`} className="block group-hover:no-underline mb-auto">
          <h3 className="text-xl font-semibold text-text mb-2 group-hover:text-note transition-colors">
            {title}
          </h3>
          <p className="text-muted text-sm leading-relaxed mb-4">
            {description}
          </p>
        </a>

        {/* Tech Stack Tags */}
        <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-border/30">
          {techStack.map((tech) => (
            <Tag key={tech}>{tech}</Tag>
          ))}
        </div>
      </NotebookCard>
    </div>
  );
};
