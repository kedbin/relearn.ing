import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import Fuse from 'fuse.js';
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
  body: string; // Raw markdown content for searching
}

// Fuse.js configuration
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

  const filteredProjects = useMemo(() => {
    if (!search.trim()) {
      return projects;
    }

    const fuse = new Fuse(projects, FUSE_OPTIONS);
    const results = fuse.search(search);
    return results.map(result => result.item);
  }, [projects, search]);

  return (
    <div className="w-full">
      {/* Search */}
      <div className="mb-12 bg-slate-900/40 p-6 rounded-2xl border border-slate-800/50">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search projects, tech stack, content..." 
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-brand-500/50 transition-colors placeholder:text-slate-600"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Results count when searching */}
      {search.trim() && (
        <p className="text-sm text-slate-500 mb-6">
          {filteredProjects.length} result{filteredProjects.length !== 1 ? 's' : ''} for "{search}"
        </p>
      )}

      {/* Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.slug}
              slug={project.slug}
              {...project.data}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 border border-dashed border-slate-800 rounded-2xl">
          <p className="text-slate-500">No projects found matching your search.</p>
          <button 
            onClick={() => setSearch('')}
            className="mt-4 text-brand-400 hover:text-brand-300 text-sm"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
};
