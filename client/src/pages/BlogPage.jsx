import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Spinner } from '../components/ui/Spinner.jsx';
import { useBlogPosts } from '../hooks/useBlogPosts.js';
import { formatDate } from '../utils/formatDate.js';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { cloudinaryUrl } from '../utils/cloudinaryUrl.js';

export const BlogPage = () => {
  const { data, isLoading, error } = useBlogPosts({ published: true });
  const posts = data?.posts || [];

  return (
    <>
      <Helmet>
        <title>Technical Blog & Tutorials | Bhushan Patil</title>
        <meta name="description" content="Read articles, software guides, and technical tutorials on MERN stack, JavaScript, and database optimization by Bhushan Patil in Surat, Gujarat." />
        <meta property="og:title" content="Technical Blog & Tutorials | Bhushan Patil" />
        <meta property="og:description" content="Read articles, software guides, and technical tutorials on MERN stack, JavaScript, and database optimization by Bhushan Patil in Surat, Gujarat." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Technical Blog & Tutorials | Bhushan Patil" />
        <meta name="twitter:description" content="Read articles, software guides, and technical tutorials on MERN stack, JavaScript, and database optimization by Bhushan Patil in Surat, Gujarat." />
        <meta name="twitter:image" content="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200" />
      </Helmet>

      <PageWrapper>
        <div className="mb-12 text-center md:text-left">
          <span className="text-blue-600 dark:text-blue-400 font-bold tracking-wider uppercase text-sm">Publications</span>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mt-1 font-heading">My Blog</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xl">
            Writing about web development, engineering best practices, and lessons learned.
          </p>
          <div className="w-16 h-1 gradient-line rounded-full mt-3 mx-auto md:mx-0" />
        </div>

        {isLoading ? (
          <Spinner size="lg" className="py-20" />
        ) : error ? (
          <div className="text-center py-20 text-slate-500">Error loading blog posts.</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <p className="text-slate-500 text-lg">No blog posts published yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <Card key={post._id} className="flex flex-col h-full group hover:-translate-y-1 transition-all duration-300">
                <div className="aspect-[2/1] overflow-hidden bg-slate-100 relative">
                  <img
                    src={cloudinaryUrl(post.coverImage?.url || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800', { width: 600 })}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                    width={600}
                    height={300}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge variant="blue">Article</Badge>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex gap-4 text-xs text-slate-400 mb-3 font-semibold">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} />
                      {formatDate(post.publishedAt || post.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <User size={13} />
                      Admin
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 hover:text-blue-600 dark:text-white transition-colors">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="slate" className="normal-case text-[10px]">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 group/link transition-colors mt-auto"
                  >
                    Read Article
                    <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </PageWrapper>
    </>
  );
};
export default BlogPage;
