import React, { lazy, Suspense } from 'react';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Layouts & Elements
import { Navbar } from './components/layout/Navbar.jsx';
import { Footer } from './components/layout/Footer.jsx';
import { BackToTop } from './components/ui/BackToTop.jsx';
import { Spinner } from './components/ui/Spinner.jsx';
import { ChatbotWidget } from './components/ui/ChatbotWidget.jsx';

// Eagerly loaded public home page for immediate LCP
import { HomePage } from './pages/HomePage.jsx';

// Lazy Loaded Pages
const ProjectsPage = lazy(() => import('./pages/ProjectsPage.jsx'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail.jsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));
const BlogPage = lazy(() => import('./pages/BlogPage.jsx'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

// Lazy Loaded Admin Pages & Layouts
const AdminLayout = lazy(() => import('./admin/AdminLayout.jsx'));
const LoginPage = lazy(() => import('./admin/LoginPage.jsx'));
const DashboardPage = lazy(() => import('./admin/DashboardPage.jsx'));
const ProjectsAdmin = lazy(() => import('./admin/projects/ProjectsAdmin.jsx'));
const ProjectForm = lazy(() => import('./admin/projects/ProjectForm.jsx'));
const AboutAdmin = lazy(() => import('./admin/about/AboutAdmin.jsx'));
const BlogAdmin = lazy(() => import('./admin/blog/BlogAdmin.jsx'));
const PostForm = lazy(() => import('./admin/blog/PostForm.jsx'));
const CategoriesAdmin = lazy(() => import('./admin/categories/CategoriesAdmin.jsx'));

// Public Layout wrapper containing common header and footer
const PublicLayout = () => {
  const location = useLocation();
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-grow flex flex-col"
          >
            <Suspense fallback={
              <div className="flex-grow flex items-center justify-center min-h-[50vh]">
                <Spinner size="lg" />
              </div>
            }>
              <Outlet />
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <BackToTop />
      <ChatbotWidget />
    </div>
  );
};

export const App = () => {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          className:
            'text-sm font-medium text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-lg rounded-xl',
          success: {
            iconTheme: {
              primary: '#185FA5',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
          <Spinner size="lg" />
        </div>
      }>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Admin Login */}
          <Route path="/admin/login" element={<LoginPage />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="projects" element={<ProjectsAdmin />} />
            <Route path="projects/new" element={<ProjectForm />} />
            <Route path="projects/edit/:id" element={<ProjectForm />} />
            <Route path="about" element={<AboutAdmin />} />
            <Route path="blog" element={<BlogAdmin />} />
            <Route path="blog/new" element={<PostForm />} />
            <Route path="blog/edit/:id" element={<PostForm />} />
            <Route path="categories" element={<CategoriesAdmin />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
