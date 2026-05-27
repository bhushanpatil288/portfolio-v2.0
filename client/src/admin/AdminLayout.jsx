import React from 'react';
import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { motion, AnimatePresence } from 'framer-motion';
import { Spinner } from '../components/ui/Spinner.jsx';
import { ThemeToggle } from '../components/ui/ThemeToggle.jsx';
import {
  LayoutDashboard,
  FolderKanban,
  UserRound,
  FileCode,
  Tags,
  LogOut,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

export const AdminLayout = () => {
  const { user, isLoading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Projects', path: '/admin/projects', icon: FolderKanban },
    { name: 'About Profile', path: '/admin/about', icon: UserRound },
    { name: 'Blog Posts', path: '/admin/blog', icon: FileCode },
    { name: 'Categories', path: '/admin/categories', icon: Tags }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="md:hidden flex justify-between items-center bg-blue-900 text-white px-4 py-3 shadow">
        <span className="font-bold tracking-tight">Admin Dashboard</span>
        <div className="flex items-center gap-2">
          <ThemeToggle className="text-slate-100 hover:bg-blue-800" />
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-blue-800 rounded">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-blue-900 text-slate-100 flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:transform-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-blue-800">
          <Link to="/" className="font-bold text-lg text-white hover:text-blue-100 flex items-center gap-1.5">
            <span className="bg-white text-blue-900 px-2 py-0.5 rounded font-extrabold text-sm">P</span>
            Portfolio Admin
          </Link>
          <ThemeToggle className="hidden md:inline-flex text-slate-200 hover:text-white hover:bg-blue-800" />
        </div>

        <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-200 hover:bg-blue-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  <span>{item.name}</span>
                </div>
                {active && <ChevronRight size={14} />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-blue-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-200 hover:bg-blue-800 hover:text-white transition-colors text-left focus:outline-none"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-20 bg-slate-950/30 backdrop-blur-sm md:hidden"
        />
      )}

      <main className="flex-grow p-6 md:p-10 max-h-screen overflow-y-auto w-full bg-slate-50 dark:bg-slate-950 transition-colors">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};
export default AdminLayout;
