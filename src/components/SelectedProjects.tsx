import React from 'react';
import { ArrowRight, Cpu } from 'lucide-react';
import { ProjectCard } from './ProjectCard';

interface Project {
  slug: string;
  data: {
    title: string;
    description: string;
    date: string;
    techStack: string[];
    demoUrl?: string;
    repoUrl?: string;
  };
}

export const SelectedProjects = ({ projects }: { projects: Project[] }) => {
  return (
    <section className="py-24 bg-slate-900/20 border-y border-slate-800/50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.3em] text-brand-300 mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              Builds
            </p>
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              Selected Projects
            </h2>
            <p className="text-slate-300 leading-relaxed">
              Applied cognitive engineering. From theory to executable code.
            </p>
          </div>
          <a
            href="/projects"
            className="group flex items-center gap-2 text-brand-300 font-semibold hover:text-brand-200 transition-colors"
          >
            View all projects
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.slice(0, 3).map((project) => (
            <ProjectCard
              key={project.slug}
              slug={project.slug}
              {...project.data}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
