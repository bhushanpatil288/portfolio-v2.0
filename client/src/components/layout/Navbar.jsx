import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { ShieldCheck, Menu, X } from 'lucide-react';

export const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Blog', path: '/blog' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-40 bg-blue-900 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 font-bold text-xl tracking-tight text-white hover:text-blue-100 transition-colors">
            <span className="bg-white text-blue-900 rounded px-2 py-0.5 font-extrabold mr-1">P</span>
            Portfolio
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-blue-400 ${
                  isActive(link.path) ? 'text-blue-400 border-b-2 border-blue-400 pb-1' : 'text-slate-200'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {user ? (
              <Link to="/admin" className="flex items-center gap-1.5 bg-blue-800 text-blue-100 hover:bg-blue-600 transition-colors text-xs font-semibold px-3 py-1.5 rounded-lg border border-blue-600">
                <ShieldCheck size={14} />
                Dashboard
              </Link>
            ) : (
              <Link to="/admin/login" className="text-xs text-slate-300 hover:text-white transition-colors">
                Admin Sign In
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white p-2 rounded-md"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-blue-950 border-t border-blue-800 animate-in slide-in-from-top duration-150">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive(link.path) ? 'bg-blue-800 text-blue-400' : 'text-slate-200 hover:bg-blue-900 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {user ? (
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium bg-blue-800 text-blue-100"
              >
                <ShieldCheck size={18} />
                Dashboard
              </Link>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white"
              >
                Admin Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
