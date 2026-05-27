import React from 'react';
import { Link } from 'react-router-dom';
import { useProfile } from '../../hooks/useProfile.js';
import { Button } from '../ui/Button.jsx';
import { FileDown, ArrowRight } from 'lucide-react';

export const HeroSection = () => {
  const { data, isLoading } = useProfile();
  const profile = data?.profile;

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <div className="h-6 bg-slate-200 rounded w-1/4 mx-auto animate-pulse mb-4"></div>
        <div className="h-10 bg-slate-200 rounded w-1/2 mx-auto animate-pulse mb-4"></div>
        <div className="h-4 bg-slate-200 rounded w-3/4 mx-auto animate-pulse"></div>
      </div>
    );
  }

  return (
    <section className="py-16 md:py-24 flex flex-col md:flex-row items-center gap-12 border-b border-slate-100 dark:border-slate-800">
      <div className="flex-grow space-y-6 text-center md:text-left">
        <span className="bg-blue-50 text-blue-800 border border-blue-100 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/60 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
          Available for Opportunities
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
          Hi, I'm <span className="text-blue-600 dark:text-blue-400">{profile?.name || 'Mayur Patil'}</span>
        </h1>
        <p className="text-xl md:text-2xl font-bold text-blue-900 dark:text-blue-300">
          {profile?.title || 'Full Stack Software Engineer'}
        </p>
        <p className="text-slate-600 dark:text-slate-400 max-w-xl text-lg leading-relaxed mx-auto md:mx-0">
          {profile?.shortBio || 'Crafting robust and elegant software solutions with clean architecture.'}
        </p>
        <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
          <Link to="/projects">
            <Button variant="primary" className="gap-2">
              View Work
              <ArrowRight size={16} />
            </Button>
          </Link>
          <a href={profile?.resumeUrl || '#'} target="_blank" rel="noopener noreferrer">
            <Button variant="secondary" className="gap-2">
              <FileDown size={16} />
              Download CV
            </Button>
          </a>
        </div>
      </div>

      <div className="flex-shrink-0">
        <div className="relative">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 blur opacity-30 animate-pulse"></div>
          <img
            src={profile?.avatar?.url || 'https://res.cloudinary.com/dsyxsipwf/image/upload/v1779881508/profile_a3nwva.png'}
            alt={profile?.name || 'Developer'}
            className="relative w-48 h-48 md:w-64 md:h-64 rounded-full object-cover border-4 border-white dark:border-slate-900 shadow-lg"
          />
        </div>
      </div>
    </section>
  );
};
