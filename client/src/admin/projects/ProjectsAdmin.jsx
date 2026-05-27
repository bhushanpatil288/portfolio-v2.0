import React from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useProjects } from '../../hooks/useProjects.js';
import { deleteProject, updateProject } from '../../api/projects.js';
import { Spinner } from '../../components/ui/Spinner.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Edit2, Trash2, Plus, Star, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/formatDate.js';

export const ProjectsAdmin = () => {
  const queryClient = useQueryClient();
  const { data: projectsData, isLoading } = useProjects();
  const projects = projectsData?.projects || [];

  const toggleFeaturedMutation = useMutation({
    mutationFn: ({ id, featured }) => updateProject({ id, projectData: { featured } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project status updated');
    },
    onError: () => {
      toast.error('Failed to update project');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete project');
    }
  });

  const handleToggleFeatured = (project) => {
    toggleFeaturedMutation.mutate({
      id: project._id,
      featured: !project.featured
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <Spinner size="lg" className="py-20" />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-Outfit">Manage Projects</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Add, modify, and feature your software development works.</p>
        </div>
        <Link to="/admin/projects/new">
          <Button variant="primary" className="gap-2">
            <Plus size={16} />
            New Project
          </Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        {projects.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            No projects found. Click "New Project" to add one!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-xs">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Categories</th>
                  <th className="px-6 py-4">Featured</th>
                  <th className="px-6 py-4">Created At</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {projects.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100 truncate max-w-xs">
                      {p.title}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {p.categories?.map((cat) => (
                          <span
                            key={cat._id}
                            className="px-2 py-0.5 rounded text-[10px] font-bold text-white"
                            style={{ backgroundColor: cat.color || '#185FA5' }}
                          >
                            {cat.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleFeatured(p)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          p.featured
                            ? 'bg-blue-50 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300'
                        }`}
                      >
                        <Star size={16} fill={p.featured ? 'currentColor' : 'none'} />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">
                      {formatDate(p.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/projects/${p.slug}`} target="_blank">
                          <Button variant="ghost" className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 border border-slate-100 dark:border-slate-700 rounded-lg">
                            <Eye size={14} />
                          </Button>
                        </Link>
                        <Link to={`/admin/projects/edit/${p._id}`}>
                          <Button variant="ghost" className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/40 border border-blue-50 dark:border-blue-900 rounded-lg">
                            <Edit2 size={14} />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          onClick={() => handleDelete(p._id)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 border border-red-50 dark:border-red-900 rounded-lg"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default ProjectsAdmin;
