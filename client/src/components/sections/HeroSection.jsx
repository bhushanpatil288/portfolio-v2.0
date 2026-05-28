import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProfile } from '../../hooks/useProfile.js';
import { Button } from '../ui/Button.jsx';
import { FileDown, ArrowRight } from 'lucide-react';
import { TypeAnimation } from 'react-type-animation';
import { cloudinaryUrl } from '../../utils/cloudinaryUrl.js';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

export const HeroSection = () => {
  const { data, isLoading } = useProfile();
  const profile = data?.profile;

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/4 mx-auto animate-pulse mb-4"></div>
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mx-auto animate-pulse mb-4"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mx-auto animate-pulse"></div>
      </div>
    );
  }

  return (
    <section className="relative w-full py-20 md:py-28 border-b border-slate-100 dark:border-slate-800">
      {/* Background mesh gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="hero-pattern absolute inset-0 dark:hidden" />
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-400/8 dark:bg-indigo-500/8 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 w-full flex flex-col md:flex-row items-center gap-12">
        {/* Text content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-grow space-y-6 text-center md:text-left"
        >
          <motion.span
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-semibold tracking-widest"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            AVAILABLE FOR OPPORTUNITIES
          </motion.span>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none font-heading"
          >
            Hi, I'm <span className="text-gradient">{profile?.name || 'Mayur Patil'}</span>
          </motion.h1>

          <motion.div variants={itemVariants}>
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
              className="text-xl font-semibold text-gray-700 dark:text-gray-300 mt-2 font-heading"
            />
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-slate-600 dark:text-slate-400 max-w-xl text-lg leading-relaxed mx-auto md:mx-0"
          >
            {profile?.shortBio || 'Crafting robust and elegant software solutions with clean architecture.'}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center md:justify-start gap-4 pt-2"
          >
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
          </motion.div>

          {/* Stats — glassmorphic card */}
          <motion.div
            variants={itemVariants}
            className="glass-card rounded-xl p-5 mt-10 max-w-md mx-auto md:mx-0"
          >
            <div className="grid grid-cols-3 divide-x divide-slate-200/50 dark:divide-slate-700/50">
              <div className="text-center px-3">
                <p className="text-2xl font-extrabold text-gradient">9+</p>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">Technologies</p>
              </div>
              <div className="text-center px-3">
                <p className="text-2xl font-extrabold text-gradient">3+</p>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">Projects built</p>
              </div>
              <div className="text-center px-3">
                <p className="text-2xl font-extrabold text-gradient">1+</p>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">Years learning</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Avatar — with proper padding to prevent clip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          className="flex-shrink-0 p-6 xl:pe-10"
        >
          <div className="relative flex items-center justify-center">
            {/* Outer glow ring — animates */}
            <div className="absolute inset-[-4px] rounded-full bg-blue-500/15 dark:bg-blue-400/15 blur-xl animate-pulse"></div>
            {/* Rotating dashed ring — contained within padding */}
            <div
              className="absolute inset-[-8px] rounded-full border-2 border-dashed border-blue-400/30 dark:border-blue-600/30 animate-spin"
              style={{ animationDuration: '20s' }}
            ></div>
            {/* Second counter-rotating ring for depth */}
            <div
              className="absolute inset-[-16px] rounded-full border border-dashed border-indigo-300/15 dark:border-indigo-500/15 animate-spin"
              style={{ animationDuration: '35s', animationDirection: 'reverse' }}
            ></div>
            <img
              src={cloudinaryUrl(profile?.avatar?.url || 'https://res.cloudinary.com/dsyxsipwf/image/upload/v1779881508/profile_a3nwva.png', { width: 300 })}
              alt={profile?.name || 'Developer'}
              className="relative w-48 h-48 md:w-64 md:h-64 bg-blue-950 rounded-full object-cover border-4 border-white dark:border-slate-900 shadow-lg"
              width={256}
              height={256}
              decoding="async"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
