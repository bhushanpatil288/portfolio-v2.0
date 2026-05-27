import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>Portfolio | Page Not Found</title>
        <meta name="description" content="Oops! The page you are looking for does not exist." />
      </Helmet>

      <PageWrapper className="flex flex-col justify-center items-center text-center py-20 px-4 min-h-[70vh]">
        <div className="relative mb-8">
          {/* Animated background glow */}
          <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-500/20 blur-3xl rounded-full w-72 h-72 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 -z-10" />
          
          <h1 className="text-8xl md:text-9xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400 select-none">
            404
          </h1>
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-4 font-Outfit">
          Lost in Space?
        </h2>
        
        <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8 leading-relaxed text-sm md:text-base">
          The page you are looking for has either disappeared, changed its name, or was never here in the first place. Let's get you back on track.
        </p>

        <Link to="/">
          <Button variant="primary" className="gap-2 px-6 py-3 font-semibold shadow-md hover:shadow-lg active:scale-95 transition-all">
            <Home size={18} />
            Back to Home
          </Button>
        </Link>
      </PageWrapper>
    </>
  );
};
export default NotFoundPage;

