import React from 'react';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useProfile } from '../hooks/useProfile.js';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { Spinner } from '../components/ui/Spinner.jsx';
import { Briefcase, Award } from 'lucide-react';

export const AboutPage = () => {
  const { data, isLoading, error } = useProfile();
  const profile = data?.profile;

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

  return (
    <>
      <Helmet>
        <title>Portfolio | About Me</title>
        <meta name="description" content={`Read the professional bio, timeline, and core technical skills of developer ${profile.name}.`} />
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
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 font-Outfit flex items-center gap-2">
                <Award className="text-blue-600" size={20} />
                Technical Competence
              </h2>
              <div className="space-y-5">
                {profile.skills?.map((skill) => (
                  <div key={skill.name} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-slate-700">{skill.name}</span>
                      <span className="text-slate-400 text-xs font-bold">Level {skill.level}/5</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${(skill.level / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  );
};
export default AboutPage;
