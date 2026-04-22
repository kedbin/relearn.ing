import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import Fuse from 'fuse.js';
import { ProjectCard } from './ProjectCard';

interface Project {
  id: string;
  data: {
    title: string;
    description: string;
    date: string;
    techStack: string[];
    demoUrl?: string;
    repoUrl?: string;
  };
  body: string;
}

const FUSE_OPTIONS = {
  keys: [
    { name: 'data.title', weight: 2 },
    { name: 'data.description', weight: 1.5 },
    { name: 'data.techStack', weight: 1.2 },
    { name: 'body', weight: 0.8 },
  ],
  threshold: 0.4,
  ignoreLocation: true,
  includeScore: true,
  minMatchCharLength: 2,
};

export const ProjectList = ({ projects }: { projects: Project[] }) => {
  const [search, setSearch] = useState('');

  const fuse = useMemo(() => new Fuse(projects, FUSE_OPTIONS), [projects]);

  const filteredProjects = useMemo(() => {
    if (!search.trim()) return projects;
    const results = fuse.search(search);
    return results.map(result => result.item);
  }, [projects, search, fuse]);

  const featured = filteredProjects[0];
  const rest = filteredProjects.slice(1);

  return (
    <div className="w-full">
      {/* Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 items-start md:items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search projects, tech stack..."
            aria-label="Search projects"
            className="w-full bg-surface border border-border/60 rounded-full pl-10 pr-4 py-2 text-sm text-text focus:outline-none focus:border-text/30 transition-colors placeholder:text-muted/50"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Results count */}
      {search.trim() && (
        <p className="text-sm text-muted mb-6">
          {filteredProjects.length} result{filteredProjects.length !== 1 ? 's' : ''} for "{search}"
        </p>
      )}

      {filteredProjects.length > 0 ? (
        <div className="space-y-8">
          {/* Featured Project */}
          {featured && !search.trim() && (
            <ProjectCard
              key={featured.id}
              id={featured.id}
              featured
              {...featured.data}
            />
          )}

          {/* Divider */}
          {featured && !search.trim() && rest.length > 0 && (
            <div className="flex items-center gap-4 pt-2">
              <span className="label-mono">All projects</span>
              <div className="flex-1 h-px bg-border/30" />
            </div>
          )}

          {/* Project Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {(search.trim() ? filteredProjects : rest).map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                {...project.data}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-24 border border-dashed border-border/40 rounded-2xl">
          <p className="text-muted">No projects found matching your search.</p>
          <button
            type="button"
            onClick={() => setSearch('')}
            className="mt-4 text-note hover:text-text text-sm"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
};
