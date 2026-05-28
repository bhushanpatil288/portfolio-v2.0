import React from 'react';
import { Link } from 'react-router-dom';
import { useProfile } from '../../hooks/useProfile.js';
import { Button } from '../ui/Button.jsx';
import { FileDown, ArrowRight } from 'lucide-react';
import { TypeAnimation } from 'react-type-animation';
import { cloudinaryUrl } from '../../utils/cloudinaryUrl.js';

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
    <section className="relative overflow-hidden py-16 md:py-24 flex flex-col md:flex-row items-center gap-12 border-b border-slate-100 dark:border-slate-800">
      {/* dot pattern — light mode only */}
      <div className="hero-pattern absolute inset-0 dark:hidden pointer-events-none" />
      <div className="flex-grow space-y-6 text-center md:text-left">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-semibold tracking-widest">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          AVAILABLE FOR OPPORTUNITIES
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">
          Hi, I'm <span className="text-blue-600 dark:text-blue-400">{profile?.name || 'Mayur Patil'}</span>
        </h1>
        <TypeAnimation
          sequence={[
            'Full Stack Developer', 2500,
            'MERN Stack Engineer', 2000,
            'Open to opportunities', 2000,
            'Building things for the web', 2000,
          ]}
          wrapper="h2"
          speed={50}
          repeat={Infinity}
          className="text-xl font-semibold text-gray-700 dark:text-gray-300 mt-2"
        />
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

        <div className="flex gap-8 mt-10 pt-8 border-t border-blue-100 dark:border-blue-900">
          <div>
            <p className="text-2xl font-bold text-blue-600">9+</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Technologies</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">3+</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Projects built</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">1+</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Years learning</p>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 xl:pe-10">
        <div className="relative flex items-center justify-center">
          {/* Outer glow ring — animates */}
          <div className="absolute inset-0 rounded-full bg-blue-500 opacity-20 blur-xl animate-pulse"></div>
          {/* Rotating dashed ring */}
          <div
            className="absolute inset-[-6px] rounded-full border-2 border-dashed border-blue-400 dark:border-blue-600 opacity-50 animate-spin"
            style={{ animationDuration: '12s' }}
          ></div>
          <img
            src={cloudinaryUrl(profile?.avatar?.url || 'https://res.cloudinary.com/dsyxsipwf/image/upload/v1779881508/profile_a3nwva.png', { width: 300 })}
            alt={profile?.name || 'Developer'}
            className="relative w-48 h-48 md:w-64 md:h-64 bg-blue-950 rounded-full object-cover border-4 border-white dark:border-slate-900 shadow-lg"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
};
