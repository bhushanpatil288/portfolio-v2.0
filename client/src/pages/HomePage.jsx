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
        <title>Portfolio | Home</title>
        <meta name="description" content="Personal portfolio website showing featured software projects, programming skills, and technical blog posts." />
        <meta property="og:title" content="Portfolio | Home" />
        <meta property="og:description" content="Personal portfolio website showing featured software projects, programming skills, and technical blog posts." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Portfolio | Home" />
        <meta name="twitter:description" content="Personal portfolio website showing featured software projects, programming skills, and technical blog posts." />
        <meta name="twitter:image" content="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200" />
      </Helmet>
      
      <PageWrapper className="py-4 md:py-6">
        <HeroSection />
      </PageWrapper>
      
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
