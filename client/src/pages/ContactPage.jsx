import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { ContactForm } from '../components/ContactForm.jsx';
import { useProfile } from '../hooks/useProfile.js';
import { Mail, Github, Linkedin, Twitter, Copy, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const ContactPage = () => {
  const { data } = useProfile();
  const profile = data?.profile;
  const [copied, setCopied] = useState(false);

  const socialLinks = [
    { icon: Mail, label: 'Email', value: profile?.socials?.email || 'admin@portfolio.dev', url: profile?.socials?.email ? `mailto:${profile.socials.email}` : '#' },
    { icon: Github, label: 'GitHub', value: 'github.com', url: profile?.socials?.github || 'https://github.com' },
    { icon: Linkedin, label: 'LinkedIn', value: 'linkedin.com', url: profile?.socials?.linkedin || 'https://linkedin.com' },
    { icon: Twitter, label: 'Twitter', value: 'twitter.com', url: profile?.socials?.twitter || 'https://twitter.com' }
  ];

  return (
    <>
      <Helmet>
        <title>Portfolio | Contact Me</title>
        <meta name="description" content="Get in touch for software projects, freelance work, or technical consulting inquiries." />
      </Helmet>

      <PageWrapper>
        <div className="mb-12 text-center md:text-left">
          <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">Get in Touch</span>
          <h1 className="text-4xl font-extrabold text-slate-900 mt-1">Contact Me</h1>
          <p className="text-slate-500 mt-2 max-w-xl">
            Have an idea or a project you'd like to collaborate on? Drop me a message!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-slate-900 font-Outfit">Contact Details</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Feel free to email me directly or connect through my social profiles. I will do my best to respond within 24 hours.
              </p>

              <div className="space-y-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-3 rounded-lg border border-slate-50 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200 w-full"
                    >
                      <span className="bg-blue-50 text-blue-800 p-2.5 rounded-lg border border-blue-100 shrink-0">
                        <Icon size={18} />
                      </span>
                      <div className="flex-grow flex items-center justify-between min-w-0">
                        <div className="min-w-0">
                          <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            {social.label}
                          </span>
                          <span className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors truncate block">
                            {social.value}
                          </span>
                        </div>
                        {social.label === 'Email' && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              navigator.clipboard.writeText(social.value);
                              toast.success('Email copied to clipboard!');
                              setCopied(true);
                              setTimeout(() => setCopied(false), 2000);
                            }}
                            className="p-2 ml-2 rounded-lg hover:bg-blue-100/50 text-slate-400 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 shrink-0"
                            title="Copy email to clipboard"
                          >
                            {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                          </button>
                        )}
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <ContactForm />
          </div>
        </div>
      </PageWrapper>
    </>
  );
};
export default ContactPage;
