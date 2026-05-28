import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '../utils/cn.js';

export const FilterBar = ({
  categories = [],
  selectedCategory = 'all',
  onSelectCategory,
  searchQuery = '',
  onSearchChange
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm mb-8 w-full">
      <div className="flex flex-wrap gap-2 w-full md:w-auto">
        <button
          onClick={() => onSelectCategory('all')}
          className={cn(
            'px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 border',
            selectedCategory === 'all'
              ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-350 dark:hover:bg-slate-700 dark:hover:text-white'
          )}
        >
          All Projects
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => onSelectCategory(cat.slug)}
            className={cn(
              'px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 border',
              selectedCategory === cat.slug
                ? 'text-white shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-350 dark:hover:bg-slate-700'
            )}
            style={
              selectedCategory === cat.slug
                ? { backgroundColor: cat.color || '#185FA5', borderColor: cat.color || '#185FA5' }
                : { borderLeftColor: cat.color || '#185FA5', borderLeftWidth: '3px' }
            }
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="relative w-full md:w-72">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
        />
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
      </div>
    </div>
  );
};
export default FilterBar;
