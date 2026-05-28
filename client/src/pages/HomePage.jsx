import React from 'react';
import { Helmet } from 'react-helmet-async';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { HeroSection } from '../components/sections/HeroSection.jsx';
import { FeaturedProjects } from '../components/sections/FeaturedProjects.jsx';
import { SkillsStrip } from '../components/sections/SkillsStrip.jsx';
import { TestimonialsSection } from '../components/sections/TestimonialsSection.jsx';

export const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Bhushan Patil | MERN Stack Developer in Surat, Gujarat</title>
        <meta name="description" content="Portfolio of Bhushan Patil, a Full Stack MERN Developer based in Surat, Gujarat. Specializing in React, Node.js, Express, MongoDB, and modern web engineering." />
        <meta property="og:title" content="Bhushan Patil | MERN Stack Developer in Surat, Gujarat" />
        <meta property="og:description" content="Portfolio of Bhushan Patil, a Full Stack MERN Developer based in Surat, Gujarat. Specializing in React, Node.js, Express, MongoDB, and modern web engineering." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Bhushan Patil | MERN Stack Developer in Surat, Gujarat" />
        <meta name="twitter:description" content="Portfolio of Bhushan Patil, a Full Stack MERN Developer based in Surat, Gujarat. Specializing in React, Node.js, Express, MongoDB, and modern web engineering." />
        <meta name="twitter:image" content="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200" />
      </Helmet>

      <HeroSection />

      <PageWrapper className="py-4 md:py-6">
        <FeaturedProjects />
      </PageWrapper>

      <SkillsStrip />

      <PageWrapper className="py-4 md:py-6">
        <TestimonialsSection />
      </PageWrapper>
    </>
  );
};
export default HomePage;
