import React from 'react';
import { Card } from './ui/Card.jsx';

export const ProjectCardSkeleton = () => {
  return (
    <Card className="flex flex-col h-full">
      {/* Cover Image Placeholder */}
      <div className="w-full aspect-video bg-slate-200 dark:bg-slate-800 animate-pulse relative" />

      {/* Content Placeholders */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Title */}
        <div className="h-6 w-2/3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-3" />

        {/* Short Description (3 lines placeholder) */}
        <div className="space-y-2 mb-6 flex-grow">
          <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-4 w-[90%] bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-4 w-[75%] bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        </div>

        {/* Tech Stack Badges */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          <div className="h-5 w-14 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
          <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
          <div className="h-5 w-10 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
        </div>

        {/* Footer Link */}
        <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mt-auto" />
      </div>
    </Card>
  );
};

export default ProjectCardSkeleton;
