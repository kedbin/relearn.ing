import React from 'react';
import { ArrowRight } from 'lucide-react';
import { NotebookCard } from '../ui/NotebookCard';
import { SectionHeader } from '../ui/SectionHeader';
import { Tag } from '../ui/Tag';

interface Project {
  slug: string;
  data: {
    title: string;
    description: string;
    date: string;
    techStack: string[];
  };
}

export const SelectedProjects = ({ projects }: { projects: Project[] }) => {
  const featured = projects.slice(0, 2);

  return (
    <section className="py-24 px-6 border-t border-border/30">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          label="Builds"
          title="Selected Projects"
          annotation="Systems I build."
          description="Applied cognitive engineering. From theory to executable code."
        />

        <div className="grid md:grid-cols-2 gap-4">
          {featured.map((project) => (
            <a key={project.slug} href={`/projects/${project.slug}`} className="group block">
              <NotebookCard className="h-full flex flex-col">
                <span className="label-mono block mb-3">{project.data.date}</span>
                <h3 className="text-xl font-semibold text-text mb-2 group-hover:text-note transition-colors">
                  {project.data.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-4 flex-grow">
                  {project.data.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.data.techStack.slice(0, 4).map((tech) => (
                    <Tag key={tech}>{tech}</Tag>
                  ))}
                </div>
              </NotebookCard>
            </a>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-text transition-colors"
          >
            View all projects <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
