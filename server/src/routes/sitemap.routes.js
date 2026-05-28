import express from 'express';
import Project from '../models/Project.js';
import BlogPost from '../models/BlogPost.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const clientUrl = process.env.CLIENT_URL || 'https://portfolio-bhushan-patil.vercel.app';
    const today = new Date().toISOString().split('T')[0];

    // Fetch active data
    const projects = await Project.find({}, 'slug');
    const blogs = await BlogPost.find({ published: true }, 'slug publishedAt');

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static pages
    const staticPages = [
      { loc: '', priority: '1.0', changefreq: 'monthly' },
      { loc: '/projects', priority: '0.8', changefreq: 'monthly' },
      { loc: '/about', priority: '0.7', changefreq: 'yearly' },
      { loc: '/contact', priority: '0.5', changefreq: 'yearly' },
      { loc: '/blog', priority: '0.8', changefreq: 'weekly' }
    ];

    staticPages.forEach(page => {
      xml += `  <url>\n`;
      xml += `    <loc>${clientUrl}${page.loc}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += `  </url>\n`;
    });

    // Dynamic projects
    projects.forEach(project => {
      xml += `  <url>\n`;
      xml += `    <loc>${clientUrl}/projects/${project.slug}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      xml += `  </url>\n`;
    });

    // Dynamic blogs
    blogs.forEach(blog => {
      const lastModDate = blog.publishedAt ? new Date(blog.publishedAt).toISOString().split('T')[0] : today;
      xml += `  <url>\n`;
      xml += `    <loc>${clientUrl}/blog/${blog.slug}</loc>\n`;
      xml += `    <lastmod>${lastModDate}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.status(200).send(xml);
  } catch (error) {
    res.status(500).send('Error generating sitemap');
  }
});

export default router;
