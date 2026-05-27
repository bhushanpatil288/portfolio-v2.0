import React from 'react';
import { Helmet } from 'react-helmet-async';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { HeroSection } from '../components/sections/HeroSection.jsx';
import { FeaturedProjects } from '../components/sections/FeaturedProjects.jsx';
import { SkillsStrip } from '../components/sections/SkillsStrip.jsx';

export const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Portfolio | Home</title>
        <meta name="description" content="Personal portfolio website showing featured software projects, programming skills, and technical blog posts." />
      </Helmet>
      
      <PageWrapper className="py-4 md:py-6">
        <HeroSection />
      </PageWrapper>
      
      <SkillsStrip />
      
      <PageWrapper className="py-4 md:py-6">
        <FeaturedProjects />
      </PageWrapper>
    </>
  );
};
export default HomePage;
