import React from 'react';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Layouts
import { Navbar } from './components/layout/Navbar.jsx';
import { Footer } from './components/layout/Footer.jsx';
import { AdminLayout } from './admin/AdminLayout.jsx';
import { BackToTop } from './components/ui/BackToTop.jsx';

// Public Pages
import { HomePage } from './pages/HomePage.jsx';
import { ProjectsPage } from './pages/ProjectsPage.jsx';
import { ProjectDetail } from './pages/ProjectDetail.jsx';
import { AboutPage } from './pages/AboutPage.jsx';
import { ContactPage } from './pages/ContactPage.jsx';
import { BlogPage } from './pages/BlogPage.jsx';
import { BlogPostPage } from './pages/BlogPostPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';

// Admin Pages
import { LoginPage } from './admin/LoginPage.jsx';
import { DashboardPage } from './admin/DashboardPage.jsx';
import { ProjectsAdmin } from './admin/projects/ProjectsAdmin.jsx';
import { ProjectForm } from './admin/projects/ProjectForm.jsx';
import { AboutAdmin } from './admin/about/AboutAdmin.jsx';
import { BlogAdmin } from './admin/blog/BlogAdmin.jsx';
import { PostForm } from './admin/blog/PostForm.jsx';
import { CategoriesAdmin } from './admin/categories/CategoriesAdmin.jsx';

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
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <BackToTop />
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
          className: 'text-sm font-medium text-slate-800 bg-white border border-slate-100 shadow-lg rounded-xl',
          success: {
            iconTheme: {
              primary: '#185FA5',
              secondary: '#fff',
            },
          },
        }}
      />
      
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
    </>
  );
};

export default App;
