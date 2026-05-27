import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import Admin from './models/Admin.js';
import Category from './models/Category.js';
import Profile from './models/Profile.js';
import Project from './models/Project.js';
import BlogPost from './models/BlogPost.js';

dotenv.config();

const seed = async () => {
  try {
    await connectDB();

    console.log('Clearing existing database contents...');
    await Admin.deleteMany({});
    await Category.deleteMany({});
    await Profile.deleteMany({});
    await Project.deleteMany({});
    await BlogPost.deleteMany({});

    console.log('Seeding Admin...');
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER || 'admin@portfolio.dev';
    const adminPassword = process.env.ADMIN_PASSWORD || process.env.EMAIL_PASS || 'Admin1234!';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPassword, salt);
    await Admin.create({
      email: adminEmail,
      passwordHash
    });
    console.log(`Admin seeded successfully with email: ${adminEmail}`);

    console.log('Seeding Categories...');
    const categories = await Category.create([
      { name: 'Frontend', color: '#378ADD' },
      { name: 'Backend', color: '#185FA5' },
      { name: 'Full Stack', color: '#0C447C' }
    ]);

    const catMap = {};
    categories.forEach(cat => {
      catMap[cat.name] = cat._id;
    });

    console.log('Seeding Profile...');
    await Profile.create({
      name: 'Developer Name',
      title: 'Full Stack Developer',
      bio: 'Hello! I am a full stack software engineer dedicated to building clean, accessible, and performant web products. I specialize in React, Node.js, and cloud systems.',
      shortBio: 'Passionate Full Stack Developer specialized in building robust web applications.',
      skills: [
        { name: 'React', level: 5 },
        { name: 'Node.js', level: 4 },
        { name: 'MongoDB', level: 4 },
        { name: 'Express', level: 4 },
        { name: 'Tailwind CSS', level: 5 },
        { name: 'REST APIs', level: 4 }
      ],
      timeline: [
        { year: '2024 - Present', role: 'Lead Developer', org: 'Tech Studio', desc: 'Lead full-stack engineering team to construct enterprise SaaS products.' },
        { year: '2022 - 2024', role: 'Software Engineer', org: 'Innovation Labs', desc: 'Built frontend visualizers, dashboards, and optimized Node backend queries.' },
        { year: '2020 - 2022', role: 'Junior Web Developer', org: 'Creative Agency', desc: 'Developed client-facing landing pages and single-page applications.' }
      ],
      resumeUrl: 'https://example.com/resume.pdf',
      socials: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com',
        email: 'admin@portfolio.dev'
      },
      avatar: {
        url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300',
        publicId: 'seed_avatar'
      }
    });

    console.log('Seeding Projects...');
    await Project.create([
      {
        title: 'Enterprise E-Commerce Hub',
        shortDesc: 'A scalable e-commerce solution with dynamic product inventory, payment integrations, and real-time checkout updates.',
        description: '## Technical Architecture\nThis enterprise e-commerce system is built to handle thousands of concurrent requests. It utilizes Redis caching for product catalogs and Stripe for secure checkout.\n\n### Key Features\n- Real-time stock status monitoring\n- High performance page loads via SSR/SSG\n- Secure checkout flow\n- Comprehensive admin panel',
        coverImage: {
          url: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=800',
          publicId: 'seed_project_1'
        },
        images: [
          {
            url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
            publicId: 'seed_project_1_sub1'
          }
        ],
        techStack: ['React', 'Node.js', 'MongoDB', 'Redux', 'Stripe'],
        categories: [catMap['Full Stack'], catMap['Backend']],
        liveUrl: 'https://example.com',
        githubUrl: 'https://github.com',
        featured: true,
        order: 1
      },
      {
        title: 'Interactive Analytics Dashboard',
        shortDesc: 'Real-time performance metrics visualizer featuring interactive charts, custom report builder, and dark mode.',
        description: '## Project Description\nAn analytics visualizer that integrates complex chart libraries to display site traffic and conversions. Uses web workers to compute heavy reports without blocking the main browser thread.\n\n### Key Features\n- Customizable drag-and-drop dashboard widgets\n- Export to CSV/PDF reports\n- Clean dark mode aesthetics',
        coverImage: {
          url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
          publicId: 'seed_project_2'
        },
        images: [],
        techStack: ['React', 'ChartJS', 'Tailwind CSS', 'Framer Motion'],
        categories: [catMap['Frontend']],
        liveUrl: 'https://example.com',
        githubUrl: 'https://github.com',
        featured: true,
        order: 2
      },
      {
        title: 'Task Management Engine',
        shortDesc: 'A powerful workflow manager featuring boards, lists, and drag-and-drop task assignments for teams.',
        description: '## Project Description\nCollaborative tool for development teams to outline product backlogs, assign sprint tasks, and review progress. Utilizes Socket.io for instantaneous update syncing across all clients.',
        coverImage: {
          url: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&q=80&w=800',
          publicId: 'seed_project_3'
        },
        images: [],
        techStack: ['Node.js', 'Express', 'Socket.io', 'MongoDB'],
        categories: [catMap['Backend'], catMap['Full Stack']],
        liveUrl: 'https://example.com',
        githubUrl: 'https://github.com',
        featured: true,
        order: 3
      }
    ]);

    console.log('Seeding Sample BlogPost...');
    await BlogPost.create({
      title: 'Mastering Modern MERN App Development',
      content: '# Introduction\nBuilding full-stack MERN apps in 2026 requires strict attention to detail, security, and responsive styling.\n\n## Best Practices Covered\n1. **HTTP-only Cookies**: Storing JWT tokens securely to prevent XSS vulnerability attacks.\n2. **Custom Blue Styling**: Colorblind-safe palettes for optimal accessibility.\n3. **Query Management**: Using React Query v5 for client cache sync.\n\nEnjoy the journey!',
      excerpt: 'Discover the industry patterns for developing highly secure, production-grade MERN applications.',
      tags: ['MERN', 'Security', 'React'],
      coverImage: {
        url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800',
        publicId: 'seed_blog_1'
      },
      published: true,
      publishedAt: new Date()
    });

    console.log('Seed complete');
    process.exit(0);
  } catch (error) {
    console.error('Error during database seed:', error);
    process.exit(1);
  }
};

seed();
