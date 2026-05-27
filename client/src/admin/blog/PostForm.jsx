import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createBlogPost, updateBlogPost } from '../../api/blog.js';
import { uploadImage, deleteImage } from '../../api/upload.js';
import { Spinner } from '../../components/ui/Spinner.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { slugify } from '../../utils/slugify.js';
import { ArrowLeft, Upload, Trash2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios.js';

export const PostForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    tags: '',
    published: false,
  });

  const [coverImage, setCoverImage] = useState(null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  const { data: postDetail, isLoading: isPostLoading } = useQuery({
    queryKey: ['post-edit', id],
    queryFn: async () => {
      const { data } = await api.get(`/blog/by-id/${id}`);
      return data;
    },
    enabled: isEditMode
  });

  useEffect(() => {
    if (isEditMode && postDetail?.post) {
      const post = postDetail.post;
      setFormData({
        title: post.title || '',
        slug: post.slug || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        tags: post.tags ? post.tags.join(', ') : '',
        published: post.published || false,
      });
      setCoverImage(post.coverImage || null);
    }
  }, [isEditMode, postDetail]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => {
        const updated = { ...prev, [name]: value };
        if (name === 'title' && !isEditMode) {
          updated.slug = slugify(value);
        }
        return updated;
      });
    }
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingCover(true);
    try {
      if (coverImage?.publicId) {
        try { await deleteImage(coverImage.publicId); } catch (err) {}
      }

      const res = await uploadImage(file);
      if (res.success) {
        setCoverImage({
          publicId: res.image.publicId,
          url: res.image.url
        });
        toast.success('Cover image uploaded successfully');
      }
    } catch (err) {
      toast.error('Failed to upload cover image');
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleRemoveCover = async () => {
    if (coverImage?.publicId) {
      try {
        await deleteImage(coverImage.publicId);
      } catch (err) {}
    }
    setCoverImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!coverImage) {
      toast.error('Please upload a cover image');
      return;
    }

    const parsedTags = formData.tags
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(t => t !== '');

    const postData = {
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt,
      content: formData.content,
      tags: parsedTags,
      published: formData.published,
      coverImage
    };

    try {
      if (isEditMode) {
        await updateBlogPost({ id, postData });
        toast.success('Blog post updated successfully');
      } else {
        await createBlogPost(postData);
        toast.success('Blog post created successfully');
      }
      queryClient.invalidateQueries({ queryKey: ['blog'] });
      navigate('/admin/blog');
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to save blog post';
      toast.error(errMsg);
    }
  };

  if (isEditMode && isPostLoading) {
    return <Spinner size="lg" className="py-20" />;
  }

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
      <div className="flex items-center gap-4 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
        <Link to="/admin/blog" className="p-2 hover:bg-slate-50 text-slate-500 rounded-lg border border-slate-100">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-Outfit">
            {isEditMode ? 'Edit Blog Post' : 'Compose Blog Post'}
          </h1>
          <p className="text-slate-500 text-sm">
            {isEditMode ? 'Modify title, content, or publication status.' : 'Scaffold and write a new technical article.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-xl border border-slate-100 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Post Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Introduction to MERN Stack"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-semibold text-slate-700 mb-1.5">
              URL Slug
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              required
              value={formData.slug}
              onChange={handleChange}
              placeholder="e.g. intro-to-mern-stack"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-semibold text-slate-700 mb-1.5">
            Excerpt / Meta Description (Short summary)
          </label>
          <input
            type="text"
            id="excerpt"
            name="excerpt"
            required
            value={formData.excerpt}
            onChange={handleChange}
            placeholder="A compelling summary shown on blog listing cards."
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-semibold text-slate-700 mb-1.5">
            Tags (comma-separated list)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g. react, tutorial, routing"
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <span className="block text-sm font-semibold text-slate-700 mb-2">Post Cover Image</span>
          {coverImage ? (
            <div className="relative w-full max-w-sm aspect-video rounded-lg overflow-hidden border border-slate-200 bg-slate-50 group">
              <img src={coverImage.url} alt="Cover" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={handleRemoveCover}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-800 text-white p-2 rounded-full shadow-md transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full max-w-sm aspect-video border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-lg cursor-pointer bg-slate-50/50 hover:bg-blue-50/5 transition-all">
              {isUploadingCover ? (
                <Spinner size="sm" />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-400">
                  <Upload size={28} className="mb-2" />
                  <p className="text-xs font-semibold">Upload cover photo</p>
                  <p className="text-[10px] text-slate-400 mt-1">PNG, JPG up to 10MB</p>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" disabled={isUploadingCover} />
            </label>
          )}
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-semibold text-slate-700 mb-1.5 flex justify-between items-center">
            Article Content (Supports Markdown)
            <span className="text-xs text-blue-600 font-medium flex items-center gap-1">
              <Sparkles size={14} />
              Markdown Enabled
            </span>
          </label>
          <textarea
            id="content"
            name="content"
            required
            rows={15}
            value={formData.content}
            onChange={handleChange}
            placeholder="# Introduction..."
            className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
        </div>

        <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-lg border border-slate-100">
          <input
            type="checkbox"
            id="published"
            name="published"
            checked={formData.published}
            onChange={handleChange}
            className="h-4.5 w-4.5 text-blue-600 border-slate-200 rounded focus:ring-blue-600"
          />
          <div>
            <label htmlFor="published" className="block text-sm font-bold text-slate-900 cursor-pointer">
              Publish immediately
            </label>
            <span className="block text-xs text-slate-500">Live posts are immediately visible on the public articles section.</span>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Link to="/admin/blog">
            <Button variant="ghost">Cancel</Button>
          </Link>
          <Button type="submit" variant="primary">
            {isEditMode ? 'Save Changes' : 'Publish Article'}
          </Button>
        </div>
      </form>
    </div>
  );
};
export default PostForm;
