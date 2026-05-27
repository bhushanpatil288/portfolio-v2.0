import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../hooks/useAuth.js';
import { Button } from '../components/ui/Button.jsx';
import { Lock, Mail } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login({ email, password });
      navigate('/admin');
    } catch (err) {
      // Handled in Context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Portfolio | Admin Login</title>
      </Helmet>

      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4 py-12">
        <div className="max-w-md w-full bg-white border border-slate-100 rounded-xl p-8 shadow-md">
          <div className="text-center mb-8">
            <span className="inline-flex bg-blue-50 text-blue-800 p-3 rounded-full border border-blue-100 mb-3">
              <Lock size={24} />
            </span>
            <h2 className="text-2xl font-bold text-slate-900 font-Outfit">Admin Control Panel</h2>
            <p className="text-slate-500 text-sm mt-1">Please enter your credentials to authenticate.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  required
                  placeholder="admin@portfolio.dev"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full justify-center py-3"
            >
              {isSubmitting ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};
export default LoginPage;
