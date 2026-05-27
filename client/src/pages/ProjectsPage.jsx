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
        <title>Portfolio | Projects</title>
        <meta name="description" content="Browse my full collection of software development projects, filtered by category and technical stack." />
      </Helmet>

      <PageWrapper>
        <div className="mb-10 text-center md:text-left">
          <span className="text-blue-600 dark:text-blue-400 font-bold tracking-wider uppercase text-sm">Showcase</span>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mt-1">My Projects</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xl">
            A gallery of applications and systems I have designed, engineered, and shipped.
          </p>
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
