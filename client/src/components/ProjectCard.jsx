import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from './ui/Card.jsx';
import { Badge } from './ui/Badge.jsx';
import { ArrowRight, Eye } from 'lucide-react';

export const ProjectCard = ({ project }) => {
  const { title, slug, shortDesc, coverImage, techStack, categories, views } = project;

  return (
    <Card className="flex flex-col h-full">
      <div className="relative aspect-video overflow-hidden bg-slate-100 group">
        <img
          src={coverImage?.url || 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=800'}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        {categories && categories.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <span
                key={cat._id}
                className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded text-white bg-slate-900/80 backdrop-blur-sm border border-white/10"
              >
                {cat.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          <Link to={`/projects/${slug}`}>{title}</Link>
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 flex-grow line-clamp-3 leading-relaxed">
          {shortDesc}
        </p>

        {techStack && techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {techStack.slice(0, 4).map((tech) => (
              <Badge key={tech} variant="blue" className="normal-case text-[10px]">
                {tech}
              </Badge>
            ))}
            {techStack.length > 4 && (
              <Badge variant="outline" className="normal-case text-[10px]">
                +{techStack.length - 4}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto">
          <Link
            to={`/projects/${slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-400 dark:hover:text-blue-300 group/link transition-colors"
          >
            View Project
            <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
          </Link>
          {typeof views === 'number' && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              <Eye size={13} />
              {views.toLocaleString()} views
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};
export default ProjectCard;
