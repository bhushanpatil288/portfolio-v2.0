import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useProject } from '../hooks/useProject.js';
import { useProjects } from '../hooks/useProjects.js';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { Spinner } from '../components/ui/Spinner.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { ProjectCard } from '../components/ProjectCard.jsx';
import { ExternalLink, Github, ArrowLeft } from 'lucide-react';

export const ProjectDetail = () => {
  const { slug } = useParams();
  const { data: projectData, isLoading: isProjectLoading, error } = useProject(slug);
  const project = projectData?.project;

  const firstCatSlug = project?.categories?.[0]?.slug;
  const { data: relatedData } = useProjects({
    category: firstCatSlug,
    limit: 4
  });

  const relatedProjects = React.useMemo(() => {
    if (!relatedData?.projects || !project) return [];
    return relatedData.projects
      .filter((p) => p._id !== project._id)
      .slice(0, 3);
  }, [relatedData, project]);

  if (isProjectLoading) {
    return (
      <PageWrapper>
        <Spinner size="lg" className="py-32" />
      </PageWrapper>
    );
  }

  if (error || !project) {
    return (
      <PageWrapper>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-slate-900">Project Not Found</h2>
          <p className="text-slate-500 mt-2 mb-6">The project you are looking for does not exist or has been moved.</p>
          <Link to="/projects">
            <Button variant="secondary">
              <ArrowLeft size={16} className="mr-2" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Project | ${project.title}`}</title>
        <meta name="description" content={project.shortDesc} />
      </Helmet>

      <div className="w-full h-[40vh] md:h-[50vh] relative bg-slate-900 overflow-hidden">
        <img
          src={project.coverImage?.url || 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=1200'}
          alt={project.title}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-6xl mx-auto px-4 pb-8 md:pb-12 text-white">
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors text-sm font-semibold mb-4"
          >
            <ArrowLeft size={16} />
            Back to Projects
          </Link>
          <div className="flex flex-wrap gap-2 mb-3">
            {project.categories?.map((cat) => (
              <span
                key={cat._id}
                className="px-2.5 py-0.5 rounded text-xs font-bold tracking-wider uppercase bg-blue-600 border border-blue-500"
                style={{ backgroundColor: cat.color }}
              >
                {cat.name}
              </span>
            ))}
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">{project.title}</h1>
        </div>
      </div>

      <PageWrapper className="pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <article className="markdown-content bg-white p-6 md:p-8 rounded-xl border border-slate-100 shadow-sm">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {project.description || '*No detailed description provided.*'}
              </ReactMarkdown>
            </article>

            {project.images && project.images.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Project Gallery</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.images.map((img, i) => (
                    <div key={i} className="aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                      <img
                        src={img.url}
                        alt={`${project.title} screenshot ${i + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4 font-Outfit">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack?.map((tech) => (
                  <Badge key={tech} variant="blue" className="normal-case text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 mb-3 font-Outfit">Links</h3>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <Button variant="primary" className="w-full gap-2 py-3 justify-center">
                    <ExternalLink size={16} />
                    Live Demo
                  </Button>
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <Button variant="secondary" className="w-full gap-2 py-3 justify-center">
                    <Github size={16} />
                    GitHub Repository
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>

        {relatedProjects.length > 0 && (
          <div className="mt-16 pt-10 border-t border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-8 font-Outfit">Related Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProjects.map((p) => (
                <ProjectCard key={p._id} project={p} />
              ))}
            </div>
          </div>
        )}
      </PageWrapper>
    </>
  );
};
export default ProjectDetail;
