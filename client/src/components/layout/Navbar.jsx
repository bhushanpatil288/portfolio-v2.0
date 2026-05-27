import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { useTheme } from '../../context/ThemeContext.jsx';
import { ShieldCheck, Menu, X, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

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

  const logoIconColor = theme === 'dark' ? '#85B7EB' : '#85B7EB';
  const logoTextColor = theme === 'dark' ? '#E6F1FB' : '#E6F1FB';
  const logoSubtitleColor = theme === 'dark' ? '#85B7EB' : '#85B7EB';

  return (
    <nav className="sticky top-0 z-40 bg-blue-900 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 font-bold text-xl tracking-tight text-white hover:text-blue-100 transition-colors">
            <svg width="180" height="40" viewBox="0 0 180 40" xmlns="http://www.w3.org/2000/svg">
              <text x="0" y="30" fontFamily="ui-monospace,monospace" fontSize="26" fontWeight="300" fill={logoIconColor}>&lt;</text>
              <text x="20" y="30" fontFamily="system-ui,sans-serif" fontSize="18" fontWeight="700" fill={logoTextColor}>bp</text>
              <text x="42" y="30" fontFamily="ui-monospace,monospace" fontSize="26" fontWeight="300" fill={logoIconColor}>/&gt;</text>
              <text x="82" y="20" fontFamily="system-ui,sans-serif" fontSize="13" fontWeight="600" fill={logoTextColor}>Bhushan Patil</text>
              <text x="82" y="34" fontFamily="system-ui,sans-serif" fontSize="10" fill={logoSubtitleColor} letterSpacing="1.5">FULL STACK DEV</text>
            </svg>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
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

            <button
              onClick={toggleTheme}
              type="button"
              className="p-2 rounded-lg text-slate-200 hover:text-white hover:bg-blue-800 transition-colors focus:outline-none"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

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

          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              type="button"
              className="p-2 rounded-lg text-slate-200 hover:text-white hover:bg-blue-800 transition-colors focus:outline-none"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setIsOpen(true)}
              className="text-slate-200 hover:text-white focus:outline-none p-2 rounded-md hover:bg-blue-800 transition-colors"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Slide-in Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 h-screen w-72 max-w-[80vw] bg-blue-950 border-l border-blue-900 shadow-2xl z-50 md:hidden flex flex-col p-6 text-white"
            >
              {/* Header with Close Button */}
              <div className="flex justify-between items-center mb-8">
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-2 font-bold text-xl tracking-tight text-white"
                >
                  <svg width="180" height="40" viewBox="0 0 180 40" xmlns="http://www.w3.org/2000/svg">
                    <text x="0" y="30" fontFamily="ui-monospace,monospace" fontSize="26" fontWeight="300" fill={logoIconColor}>&lt;</text>
                    <text x="20" y="30" fontFamily="system-ui,sans-serif" fontSize="18" fontWeight="700" fill={logoTextColor}>bp</text>
                    <text x="42" y="30" fontFamily="ui-monospace,monospace" fontSize="26" fontWeight="300" fill={logoIconColor}>/&gt;</text>
                    <text x="82" y="20" fontFamily="system-ui,sans-serif" fontSize="13" fontWeight="600" fill={logoTextColor}>Bhushan Patil</text>
                    <text x="82" y="34" fontFamily="system-ui,sans-serif" fontSize="10" fill={logoSubtitleColor} letterSpacing="1.5">FULL STACK DEV</text>
                  </svg>
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-300 hover:text-white p-2 rounded-lg hover:bg-blue-900 transition-colors focus:outline-none"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-2.5 rounded-lg text-base font-semibold transition-all duration-200 ${
                      isActive(link.path)
                        ? 'bg-blue-800 text-white shadow-sm border border-blue-600/30'
                        : 'text-slate-300 hover:bg-blue-900/60 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Bottom Actions */}
              <div className="mt-auto pt-6 border-t border-blue-900 flex flex-col gap-4">
                {user ? (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 w-full bg-blue-800 text-blue-100 hover:bg-blue-700 transition-colors text-sm font-semibold px-4 py-3 rounded-lg border border-blue-600 shadow-sm"
                  >
                    <ShieldCheck size={18} />
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/admin/login"
                    onClick={() => setIsOpen(false)}
                    className="text-center text-sm font-medium text-slate-400 hover:text-white transition-colors py-2"
                  >
                    Admin Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
