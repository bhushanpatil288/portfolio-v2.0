import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCategories, createProject, updateProject } from '../../api/projects.js';
import { uploadImage, deleteImage } from '../../api/upload.js';
import { Spinner } from '../../components/ui/Spinner.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { slugify } from '../../utils/slugify.js';
import { ArrowLeft, Upload, Trash2, X, Plus, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios.js';

export const ProjectForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortDesc: '',
    description: '',
    liveUrl: '',
    githubUrl: '',
    techStack: '',
    categories: [],
    featured: false,
  });

  const [coverImage, setCoverImage] = useState(null);
  const [images, setImages] = useState([]);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  const { data: catData, isLoading: isCatsLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  });
  const categoriesList = catData?.categories || [];

  const { data: projectDetail, isLoading: isProjectLoading } = useQuery({
    queryKey: ['project-edit', id],
    queryFn: async () => {
      const { data } = await api.get(`/projects/by-id/${id}`);
      return data;
    },
    enabled: isEditMode
  });

  useEffect(() => {
    if (isEditMode && projectDetail?.project) {
      const p = projectDetail.project;
      setFormData({
        title: p.title || '',
        slug: p.slug || '',
        shortDesc: p.shortDesc || '',
        description: p.description || '',
        liveUrl: p.liveUrl || '',
        githubUrl: p.githubUrl || '',
        techStack: p.techStack ? p.techStack.join(', ') : '',
        categories: p.categories ? p.categories.map(c => c._id || c) : [],
        featured: p.featured || false,
      });
      setCoverImage(p.coverImage || null);
      setImages(p.images || []);
    }
  }, [isEditMode, projectDetail]);

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

  const handleCategoryChange = (catId) => {
    setFormData(prev => {
      const currentCats = [...prev.categories];
      const idx = currentCats.indexOf(catId);
      if (idx > -1) {
        currentCats.splice(idx, 1);
      } else {
        currentCats.push(catId);
      }
      return { ...prev, categories: currentCats };
    });
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

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploadingGallery(true);
    try {
      const uploaded = [];
      for (const file of files) {
        const res = await uploadImage(file);
        if (res.success) {
          uploaded.push({
            publicId: res.image.publicId,
            url: res.image.url
          });
        }
      }
      setImages(prev => [...prev, ...uploaded]);
      toast.success(`Uploaded ${uploaded.length} screenshots`);
    } catch (err) {
      toast.error('Failed to upload gallery images');
    } finally {
      setIsUploadingGallery(false);
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

  const handleRemoveGalleryImage = async (index) => {
    const img = images[index];
    if (img.publicId) {
      try {
        await deleteImage(img.publicId);
      } catch (err) {}
    }
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!coverImage) {
      toast.error('Please upload a cover image');
      return;
    }

    const parsedTechStack = formData.techStack
      .split(',')
      .map(t => t.trim())
      .filter(t => t !== '');

    const projectData = {
      title: formData.title,
      slug: formData.slug,
      shortDesc: formData.shortDesc,
      description: formData.description,
      liveUrl: formData.liveUrl,
      githubUrl: formData.githubUrl,
      techStack: parsedTechStack,
      categories: formData.categories,
      featured: formData.featured,
      coverImage,
      images
    };

    try {
      if (isEditMode) {
        await updateProject({ id, projectData });
        toast.success('Project updated successfully');
      } else {
        await createProject(projectData);
        toast.success('Project created successfully');
      }
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      navigate('/admin/projects');
    } catch (error) {
      const errMsg = error.response?.data?.message || 'Failed to save project';
      toast.error(errMsg);
    }
  };

  const isLoading = isCatsLoading || (isEditMode && isProjectLoading);

  if (isLoading) {
    return <Spinner size="lg" className="py-20" />;
  }

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
      <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <Link to="/admin/projects" className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg border border-slate-100 dark:border-slate-700">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-Outfit">
            {isEditMode ? 'Edit Project' : 'Add New Project'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {isEditMode ? 'Modify details, stack, and gallery screenshots.' : 'Create a showcase entry for your work.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Project Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Chat App"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              URL Slug
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              required
              value={formData.slug}
              onChange={handleChange}
              placeholder="e.g. chat-app"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div>
          <label htmlFor="shortDesc" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Short Summary (1-2 sentences)
          </label>
          <input
            type="text"
            id="shortDesc"
            name="shortDesc"
            required
            value={formData.shortDesc}
            onChange={handleChange}
            placeholder="A brief overview of the project shown on listing cards."
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <span className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Project Categories</span>
          {categoriesList.length === 0 ? (
            <p className="text-slate-400 text-xs italic">No categories created yet. Please create one first.</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {categoriesList.map((cat) => {
                const checked = formData.categories.includes(cat._id);
                return (
                  <button
                    type="button"
                    key={cat._id}
                    onClick={() => handleCategoryChange(cat._id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                      checked
                        ? 'text-white border-blue-600'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                    style={checked ? { backgroundColor: cat.color || '#185FA5', borderColor: cat.color || '#185FA5' } : {}}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white" style={!checked ? { backgroundColor: cat.color } : {}} />
                    {cat.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="techStack" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Tech Stack (comma-separated tags)
          </label>
          <input
            type="text"
            id="techStack"
            name="techStack"
            required
            value={formData.techStack}
            onChange={handleChange}
            placeholder="e.g. React, Node.js, Express, MongoDB, Tailwind"
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="liveUrl" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Live Demo URL
            </label>
            <input
              type="url"
              id="liveUrl"
              name="liveUrl"
              value={formData.liveUrl}
              onChange={handleChange}
              placeholder="https://example.com"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label htmlFor="githubUrl" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              GitHub Repository URL
            </label>
            <input
              type="url"
              id="githubUrl"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              placeholder="https://github.com/username/repo"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div>
          <span className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Cover Image</span>
          {coverImage ? (
            <div className="relative w-full max-w-sm aspect-video rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 group">
              <img src={coverImage.url} alt="Project Cover" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={handleRemoveCover}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-800 text-white p-2 rounded-full shadow-md transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full max-w-sm aspect-video border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-400 rounded-lg cursor-pointer bg-slate-50/50 dark:bg-slate-800/40 hover:bg-blue-50/5 transition-all">
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
          <span className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Screenshot Gallery</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            {images.map((img, i) => (
              <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 group">
                <img src={img.url} alt={`Screenshot ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveGalleryImage(i)}
                  className="absolute top-1.5 right-1.5 bg-red-600 text-white p-1 rounded-full shadow hover:bg-red-800 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-blue-400 rounded-lg cursor-pointer bg-slate-50/50 dark:bg-slate-800/40 hover:bg-blue-50/5 transition-all">
              {isUploadingGallery ? (
                <Spinner size="sm" />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400">
                  <Plus size={20} className="mb-1" />
                  <span className="text-[10px] font-semibold">Add screenshot</span>
                </div>
              )}
              <input type="file" multiple accept="image/*" onChange={handleGalleryUpload} className="hidden" disabled={isUploadingGallery} />
            </label>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex justify-between items-center">
            Detailed Description (Supports Markdown)
            <span className="text-xs text-blue-600 font-medium flex items-center gap-1">
              <Sparkles size={14} />
              Markdown Enabled
            </span>
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={12}
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your project, architecture decisions, hurdles overcome, and lessons learned..."
            className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
        </div>

        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
          <input
            type="checkbox"
            id="featured"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="h-4.5 w-4.5 text-blue-600 border-slate-200 dark:border-slate-700 rounded focus:ring-blue-600"
          />
          <div>
            <label htmlFor="featured" className="block text-sm font-bold text-slate-900 dark:text-slate-100 cursor-pointer">
              Feature this project
            </label>
            <span className="block text-xs text-slate-500 dark:text-slate-400">Featured projects appear directly on the homepage banner.</span>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Link to="/admin/projects">
            <Button variant="ghost">Cancel</Button>
          </Link>
          <Button type="submit" variant="primary">
            {isEditMode ? 'Save Changes' : 'Publish Project'}
          </Button>
        </div>
      </form>
    </div>
  );
};
export default ProjectForm;
