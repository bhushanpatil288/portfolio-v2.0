import React from 'react';
import { useProfile } from '../../hooks/useProfile.js';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';

export const Footer = () => {
  const { data } = useProfile();
  const profile = data?.profile;
  
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, url: profile?.socials?.github || 'https://github.com', label: 'GitHub Profile' },
    { icon: Linkedin, url: profile?.socials?.linkedin || 'https://linkedin.com', label: 'LinkedIn Profile' },
    { icon: Twitter, url: profile?.socials?.twitter || 'https://twitter.com', label: 'Twitter Profile' },
    { icon: Mail, url: profile?.socials?.email ? `mailto:${profile.socials.email}` : '#', label: 'Email Address' }
  ];

  return (
    <footer className="bg-slate-950 text-slate-400 py-10 mt-auto border-t border-slate-900">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <p className="text-white font-bold text-lg mb-1">{profile?.name || 'Developer Name'}</p>
          <p className="text-sm">{profile?.title || 'Full Stack Developer'}</p>
        </div>

        <div className="flex space-x-6">
          {socialLinks.map((social, index) => {
            const Icon = social.icon;
            return (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors duration-200"
                aria-label={social.label}
              >
                <Icon size={20} />
              </a>
            );
          })}
        </div>

        <div className="text-sm text-slate-400">
          © {currentYear} {profile?.name || 'Developer Name'}. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
