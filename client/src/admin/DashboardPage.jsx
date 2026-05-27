import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useProjects } from '../hooks/useProjects.js';
import { useBlogPosts } from '../hooks/useBlogPosts.js';
import { useProfile } from '../hooks/useProfile.js';
import { getCategories } from '../api/projects.js';
import { Card } from '../components/ui/Card.jsx';
import { Spinner } from '../components/ui/Spinner.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import {
  FolderKanban,
  FileCode,
  Tags,
  Plus,
  ArrowUpRight,
  Edit2,
  Eye
} from 'lucide-react';
import { formatDate } from '../utils/formatDate.js';

export const DashboardPage = () => {
  const { data: projectsData, isLoading: isProjectsLoading } = useProjects();
  const { data: blogData, isLoading: isBlogLoading } = useBlogPosts();
  const { data: profileData, isLoading: isProfileLoading } = useProfile();
  const { data: categoriesData, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  });

  const projects = projectsData?.projects || [];
  const posts = blogData?.posts || [];
  const categories = categoriesData?.categories || [];

  const isLoading = isProjectsLoading || isBlogLoading || isProfileLoading || isCategoriesLoading;

  if (isLoading) {
    return <Spinner size="lg" className="py-20" />;
  }

  const totalProjects = projects.length;
  const totalPosts = posts.length;
  const featuredProjects = projects.filter(p => p.featured).length;

  const stats = [
    { label: 'Total Projects', value: totalProjects, icon: FolderKanban, color: 'text-blue-600 bg-blue-50 border-blue-100' },
    { label: 'Blog Articles', value: totalPosts, icon: FileCode, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { label: 'Featured Projects', value: featuredProjects, icon: Eye, color: 'text-purple-600 bg-purple-50 border-purple-100' },
    { label: 'Content Categories', value: categories.length, icon: Tags, color: 'text-amber-600 bg-amber-50 border-amber-100' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 font-Outfit">Welcome back, Admin!</h1>
          <p className="text-slate-500 text-sm mt-1">Here is a summary of your portfolio state.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/projects/new">
            <Button variant="primary" className="gap-1.5 text-xs font-semibold py-2">
              <Plus size={16} />
              Add Project
            </Button>
          </Link>
          <Link to="/admin/blog/new">
            <Button variant="secondary" className="gap-1.5 text-xs font-semibold py-2">
              <Plus size={16} />
              Add Post
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="p-6 flex items-center justify-between">
              <div>
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</span>
                <span className="text-3xl font-extrabold text-slate-800">{stat.value}</span>
              </div>
              <span className={`p-3 rounded-lg border ${stat.color}`}>
                <Icon size={24} />
              </span>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 font-Outfit flex items-center gap-2">
              <FolderKanban size={18} className="text-blue-600" />
              Recent Projects
            </h3>
            <Link to="/admin/projects" className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-0.5">
              Manage All
              <ArrowUpRight size={14} />
            </Link>
          </div>
          {projects.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-6">No projects created yet.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {projects.slice(0, 3).map((p) => (
                <div key={p._id} className="py-3 flex justify-between items-center gap-4">
                  <div className="truncate">
                    <span className="block text-sm font-bold text-slate-800 truncate hover:text-blue-600">
                      <Link to={`/projects/${p.slug}`}>{p.title}</Link>
                    </span>
                    <span className="text-xs text-slate-400">Created: {formatDate(p.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.featured && <Badge variant="blue">Featured</Badge>}
                    <Link to={`/admin/projects/edit/${p._id}`}>
                      <button className="p-1.5 hover:bg-slate-50 text-slate-500 hover:text-blue-600 rounded border border-slate-100 transition-colors">
                        <Edit2 size={13} />
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900 font-Outfit flex items-center gap-2">
              <FileCode size={18} className="text-emerald-600" />
              Recent Articles
            </h3>
            <Link to="/admin/blog" className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-0.5">
              Manage All
              <ArrowUpRight size={14} />
            </Link>
          </div>
          {posts.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-6">No posts written yet.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {posts.slice(0, 3).map((post) => (
                <div key={post._id} className="py-3 flex justify-between items-center gap-4">
                  <div className="truncate">
                    <span className="block text-sm font-bold text-slate-800 truncate hover:text-blue-600">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </span>
                    <span className="text-xs text-slate-400">Created: {formatDate(post.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {post.published ? (
                      <Badge variant="blue" className="bg-emerald-50 text-emerald-800 border-emerald-200">Live</Badge>
                    ) : (
                      <Badge variant="outline">Draft</Badge>
                    )}
                    <Link to={`/admin/blog/edit/${post._id}`}>
                      <button className="p-1.5 hover:bg-slate-50 text-slate-500 hover:text-blue-600 rounded border border-slate-100 transition-colors">
                        <Edit2 size={13} />
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default DashboardPage;
