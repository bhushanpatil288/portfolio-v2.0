import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { FilterBar } from '../components/FilterBar.jsx';
import { ProjectCard } from '../components/ProjectCard.jsx';
import { ProjectCardSkeleton } from '../components/ProjectCardSkeleton.jsx';
import { useProjects } from '../hooks/useProjects.js';
import { getCategories } from '../api/projects.js';
import { useQuery } from '@tanstack/react-query';

export const ProjectsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: projectsData, isLoading: isProjectsLoading } = useProjects();
  const projects = projectsData?.projects || [];

  const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  });
  const categories = categoriesData?.categories || [];

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        project.categories.some((cat) => cat.slug === selectedCategory);

      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.techStack.some((tech) =>
          tech.toLowerCase().includes(searchQuery.toLowerCase())
        );

      return matchesCategory && matchesSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  const isLoading = isProjectsLoading || isCategoriesLoading;

  return (
    <>
      <Helmet>
        <title>Projects by Bhushan Patil | MERN Stack Developer Portfolio</title>
        <meta name="description" content="Explore a collection of modern, responsive full-stack MERN and frontend applications engineered by Bhushan Patil in Surat, Gujarat." />
        <meta property="og:title" content="Projects by Bhushan Patil | MERN Stack Developer Portfolio" />
        <meta property="og:description" content="Explore a collection of modern, responsive full-stack MERN and frontend applications engineered by Bhushan Patil in Surat, Gujarat." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Projects by Bhushan Patil | MERN Stack Developer Portfolio" />
        <meta name="twitter:description" content="Explore a collection of modern, responsive full-stack MERN and frontend applications engineered by Bhushan Patil in Surat, Gujarat." />
        <meta name="twitter:image" content="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200" />
      </Helmet>

      <PageWrapper>
        <div className="mb-10 text-center md:text-left">
          <span className="text-blue-600 dark:text-blue-400 font-bold tracking-wider uppercase text-sm">Showcase</span>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mt-1 font-heading">My Projects</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xl">
            A gallery of applications and systems I have designed, engineered, and shipped.
          </p>
          <div className="w-16 h-1 gradient-line rounded-full mt-3 mx-auto md:mx-0" />
        </div>

        <FilterBar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <ProjectCardSkeleton key={index} />
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-lg">No projects match your filter criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="text-blue-600 dark:text-blue-400 font-semibold mt-2 hover:underline focus:outline-none"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </PageWrapper>
    </>
  );
};
export default ProjectsPage;
