import React from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useBlogPosts } from '../../hooks/useBlogPosts.js';
import { deleteBlogPost, updateBlogPost } from '../../api/blog.js';
import { Spinner } from '../../components/ui/Spinner.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Edit2, Trash2, Plus, Globe, Eye, FileEdit } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/formatDate.js';

export const BlogAdmin = () => {
  const queryClient = useQueryClient();
  const { data: blogData, isLoading } = useBlogPosts();
  const posts = blogData?.posts || [];

  const togglePublishMutation = useMutation({
    mutationFn: ({ id, published }) => updateBlogPost({ id, postData: { published } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog'] });
      toast.success('Post visibility updated');
    },
    onError: () => {
      toast.error('Failed to update post');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog'] });
      toast.success('Article deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete article');
    }
  });

  const handleTogglePublish = (post) => {
    togglePublishMutation.mutate({
      id: post._id,
      published: !post.published
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <Spinner size="lg" className="py-20" />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-Outfit">Manage Blog Posts</h1>
          <p className="text-slate-500 text-sm">Write articles, edit tutorials, and toggle draft/published flags.</p>
        </div>
        <Link to="/admin/blog/new">
          <Button variant="primary" className="gap-2">
            <Plus size={16} />
            Write Post
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        {posts.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            No articles found. Click "Write Post" to draft your first article!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-xs">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created At</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {posts.map((post) => (
                  <tr key={post._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 truncate max-w-xs md:max-w-md">
                      {post.title}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleTogglePublish(post)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                          post.published
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                            : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {post.published ? (
                          <>
                            <Globe size={12} className="text-emerald-600" />
                            Live
                          </>
                        ) : (
                          <>
                            <FileEdit size={12} className="text-slate-400" />
                            Draft
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {formatDate(post.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {post.published && (
                          <Link to={`/blog/${post.slug}`} target="_blank">
                            <Button variant="ghost" className="p-2 text-slate-500 hover:text-slate-900 border border-slate-100 rounded-lg">
                              <Eye size={14} />
                            </Button>
                          </Link>
                        )}
                        <Link to={`/admin/blog/edit/${post._id}`}>
                          <Button variant="ghost" className="p-2 text-blue-600 hover:bg-blue-50 border border-blue-50 rounded-lg">
                            <Edit2 size={14} />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          onClick={() => handleDelete(post._id)}
                          className="p-2 text-red-600 hover:bg-red-50 border border-red-50 rounded-lg"
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
export default BlogAdmin;
