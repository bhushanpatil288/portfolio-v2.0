import React from 'react';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useProfile } from '../hooks/useProfile.js';
import { useTheme } from '../context/ThemeContext.jsx';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { Spinner } from '../components/ui/Spinner.jsx';
import { Briefcase, Award, Github, BookOpen, Terminal, Cpu, Layers } from 'lucide-react';
import { GitHubCalendar } from 'react-github-calendar';

export const AboutPage = () => {
  const { data, isLoading, error } = useProfile();
  const { theme } = useTheme();
  const profile = data?.profile;

  const getGitHubUsername = (url) => {
    if (!url) return '';
    const parts = url.replace(/\/$/, '').split('/');
    return parts[parts.length - 1] || '';
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <Spinner size="lg" className="py-32" />
      </PageWrapper>
    );
  }

  if (error || !profile) {
    return (
      <PageWrapper>
        <div className="text-center py-20 text-slate-500">
          Error loading profile information.
        </div>
      </PageWrapper>
    );
  }

  const githubUsername = getGitHubUsername(profile.socials?.github) || 'bhushanpatil288';

  return (
    <>
      <Helmet>
        <title>Portfolio | About Me</title>
        <meta name="description" content={`Read the professional bio, timeline, and core technical skills of developer ${profile.name}.`} />
        <meta property="og:title" content="Portfolio | About Me" />
        <meta property="og:description" content={`Read the professional bio, timeline, and core technical skills of developer ${profile.name}.`} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content={profile.avatar?.url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200'} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Portfolio | About Me" />
        <meta name="twitter:description" content={`Read the professional bio, timeline, and core technical skills of developer ${profile.name}.`} />
        <meta name="twitter:image" content={profile.avatar?.url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200'} />
      </Helmet>

      <PageWrapper>
        <div className="mb-12 text-center md:text-left">
          <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">Background</span>
          <h1 className="text-4xl font-extrabold text-slate-900 mt-1">About Me</h1>
          <p className="text-slate-500 mt-2 max-w-xl">
            My journey, skills, and professional experience in software engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-100 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 font-Outfit">My Story</h2>
              <div className="markdown-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {profile.bio || '*No bio description provided.*'}
                </ReactMarkdown>
              </div>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-100 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-8 font-Outfit">Professional Journey</h2>
              <div className="relative border-l-2 border-slate-100 ml-4 space-y-8">
                {profile.timeline?.map((item, index) => (
                  <div key={index} className="relative pl-8">
                    <span className="absolute -left-[17px] top-1 bg-white border-2 border-blue-600 rounded-full p-1 text-blue-600 shadow-sm">
                      <Briefcase size={12} />
                    </span>
                    <div className="flex flex-wrap items-baseline gap-2 mb-1">
                      <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {item.year}
                      </span>
                      <h4 className="text-lg font-bold text-slate-900">{item.role}</h4>
                    </div>
                    <p className="text-sm font-semibold text-slate-500 mb-2">{item.org}</p>
                    <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 font-Outfit flex items-center gap-2">
                <Award className="text-blue-600 dark:text-blue-400" size={20} />
                Technical Competence
              </h2>
              <div className="space-y-5">
                {profile.skills?.map((skill) => (
                  <div key={skill.name} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{skill.name}</span>
                      <span className="text-slate-400 dark:text-slate-500 text-xs font-bold">Level {skill.level}/5</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-850 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 dark:bg-blue-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${(skill.level / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What I'm Learning Now Box */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm relative overflow-hidden animate-fade-in">
              {/* Pulse Indicator */}
              {profile.currentlyLearning?.length > 0 && (
                <div className="absolute top-6 right-6 flex items-center gap-1.5 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 text-xs px-2.5 py-1 rounded-full font-bold">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Active Focus
                </div>
              )}

              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 font-Outfit flex items-center gap-2">
                <BookOpen className="text-blue-600 dark:text-blue-400" size={20} />
                Learning Now
              </h2>

              <div className="space-y-4">
                {profile.currentlyLearning?.length > 0 ? (
                  profile.currentlyLearning.map((item, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 dark:bg-slate-800/30 rounded-lg border border-slate-100/50 dark:border-slate-800/50">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="p-1.5 bg-blue-50 dark:bg-blue-900/30 rounded text-blue-600 dark:text-blue-400">
                          <Terminal size={14} />
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h4>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                        {item.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No current learning topics listed.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* GitHub Contributions Graph */}
        <div className="mt-12 bg-white p-6 md:p-8 rounded-xl border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-6 font-Outfit flex items-center gap-2">
            <Github className="text-blue-600" size={22} />
            GitHub Code Activity
          </h3>
          <div className="overflow-x-auto flex justify-center py-2">
            <GitHubCalendar
              username={githubUsername}
              colorScheme={theme === 'dark' ? 'dark' : 'light'}
              fontSize={12}
              blockSize={12}
              blockMargin={4}
            />
          </div>
        </div>
      </PageWrapper>
    </>
  );
};
export default AboutPage;
