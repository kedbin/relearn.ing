import React from 'react';
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

export const ProjectList = ({ projects }: { projects: Project[] }) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.slug}
          slug={project.slug}
          {...project.data}
        />
      ))}
    </div>
  );
};
