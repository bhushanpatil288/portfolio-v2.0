import React from 'react';
import { useProfile } from '../../hooks/useProfile.js';
import { Spinner } from '../ui/Spinner.jsx';

export const SkillsStrip = () => {
  const { data, isLoading } = useProfile();
  const skills = data?.profile?.skills || [];

  if (isLoading) {
    return <Spinner size="sm" />;
  }

  if (skills.length === 0) {
    return null;
  }

  const scrolledSkills = [...skills, ...skills, ...skills];

  return (
    <section className="py-12 bg-slate-50 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-800 overflow-hidden select-none">
      <div className="max-w-6xl mx-auto px-4 mb-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-center md:text-left">
          Core Technologies & Stack
        </h3>
      </div>
      
      <div className="relative w-full flex items-center overflow-x-hidden">
        <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none" />

        <div className="flex gap-4 animate-scroll whitespace-nowrap py-2">
          {scrolledSkills.map((skill, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2.5 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm hover:border-blue-400 dark:hover:border-blue-400 hover:shadow transition-all duration-200 cursor-default"
            >
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{skill.name}</span>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 w-1.5 rounded-full ${
                      i < skill.level ? 'bg-blue-600 dark:bg-blue-400' : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333333%);
          }
        }
        .animate-scroll {
          animation: scroll 25s linear infinite;
          width: max-content;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};
