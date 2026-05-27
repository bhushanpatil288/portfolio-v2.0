import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Home, AlertCircle } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>Portfolio | Page Not Found</title>
        <meta name="description" content="The page you are looking for does not exist." />
      </Helmet>

      <PageWrapper className="justify-center items-center text-center py-20">
        <AlertCircle size={64} className="text-blue-600 mb-6 animate-bounce" />
        <h1 className="text-6xl font-extrabold text-slate-900 tracking-tight mb-2">404</h1>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Page Not Found</h2>
        <p className="text-slate-500 max-w-md mb-8 leading-relaxed">
          Oops! The page you are looking for has either disappeared, changed its name, or was never here in the first place.
        </p>
        <Link to="/">
          <Button variant="primary" className="gap-2">
            <Home size={16} />
            Back to Home
          </Button>
        </Link>
      </PageWrapper>
    </>
  );
};
export default NotFoundPage;
