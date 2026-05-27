import React from 'react';
import { useProjects } from '../../hooks/useProjects.js';
import { ProjectCard } from '../ProjectCard.jsx';
import { Spinner } from '../ui/Spinner.jsx';
import { Button } from '../ui/Button.jsx';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const FeaturedProjects = () => {
  const { data, isLoading, error } = useProjects({ featured: true, limit: 3 });
  const projects = data?.projects || [];

  return (
    <section className="py-16 border-b border-slate-100">
      <div className="flex justify-between items-end mb-10">
        <div>
          <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">Portfolio Portfolio</span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Featured Projects</h2>
        </div>
        <Link to="/projects" className="hidden sm:block">
          <Button variant="ghost" className="gap-1.5 text-blue-600 hover:text-blue-400">
            View All Projects
            <ArrowRight size={16} />
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <Spinner size="lg" />
      ) : error ? (
        <div className="text-center text-slate-500 py-10">Error loading projects.</div>
      ) : projects.length === 0 ? (
        <div className="text-center text-slate-500 py-10">No projects to showcase. Check back soon!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}

      <div className="text-center mt-10 sm:hidden">
        <Link to="/projects">
          <Button variant="ghost" className="gap-1.5 text-blue-600">
            View All Projects
            <ArrowRight size={16} />
          </Button>
        </Link>
      </div>
    </section>
  );
};
