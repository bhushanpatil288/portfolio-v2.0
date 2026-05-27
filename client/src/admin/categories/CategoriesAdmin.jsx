import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../api/projects.js';
import { Spinner } from '../../components/ui/Spinner.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { Edit2, Trash2, Plus, Tags } from 'lucide-react';
import toast from 'react-hot-toast';
import { slugify } from '../../utils/slugify.js';

export const CategoriesAdmin = () => {
  const queryClient = useQueryClient();
  const { data: catData, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  });
  const categories = catData?.categories || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [color, setColor] = useState('#185FA5');

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created successfully');
      closeModal();
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Failed to create category';
      toast.error(msg);
    }
  });

  const updateMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated successfully');
      closeModal();
    },
    onError: (error) => {
      const msg = error.response?.data?.message || 'Failed to update category';
      toast.error(msg);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete category');
    }
  });

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setColor('#185FA5');
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setColor(cat.color || '#185FA5');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setName('');
    setSlug('');
    setColor('#185FA5');
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    setName(val);
    if (!editingCategory) {
      setSlug(slugify(val));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category? Projects using it will have the category link removed.')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;

    const payload = { name: name.trim(), slug: slug.trim(), color };

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory._id, catData: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  if (isLoading) {
    return <Spinner size="lg" className="py-20" />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 font-Outfit">Manage Categories</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Group projects using tags (e.g. Frontend, Fullstack, Mobile).</p>
        </div>
        <Button variant="primary" className="gap-2" onClick={openAddModal}>
          <Plus size={16} />
          New Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.length === 0 ? (
          <div className="md:col-span-3 text-center py-20 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm text-slate-400">
            No categories found. Create your first category!
          </div>
        ) : (
          categories.map((cat) => (
            <div
              key={cat._id}
              className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
              style={{ borderLeft: `4px solid ${cat.color || '#185FA5'}` }}
            >
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-Outfit mb-1 flex items-center gap-2">
                  <Tags size={16} style={{ color: cat.color }} />
                  {cat.name}
                </h3>
                <span className="text-xs text-slate-400 font-mono">Slug: {cat.slug}</span>
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-50 dark:border-slate-800">
                <Button
                  variant="ghost"
                  onClick={() => openEditModal(cat)}
                  className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/40 border border-blue-50 dark:border-blue-900 rounded-lg"
                >
                  <Edit2 size={13} />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => handleDelete(cat._id)}
                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 border border-red-50 dark:border-red-900 rounded-lg"
                >
                  <Trash2 size={13} />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingCategory ? 'Edit Category' : 'Create Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="cat-name" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Category Name
            </label>
            <input
              type="text"
              id="cat-name"
              required
              value={name}
              onChange={handleNameChange}
              placeholder="e.g. Fullstack"
              className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label htmlFor="cat-slug" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              URL Slug
            </label>
            <input
              type="text"
              id="cat-slug"
              required
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              placeholder="e.g. fullstack"
              className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label htmlFor="cat-color" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Category Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                id="cat-color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-10 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer p-1"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="#185FA5"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="ghost" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default CategoriesAdmin;
