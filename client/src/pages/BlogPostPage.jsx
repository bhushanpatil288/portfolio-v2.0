import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { useBlogPost } from '../hooks/useBlogPost.js';
import { PageWrapper } from '../components/layout/PageWrapper.jsx';
import { Spinner } from '../components/ui/Spinner.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { formatDate } from '../utils/formatDate.js';
import 'highlight.js/styles/github-dark.css';

export const BlogPostPage = () => {
  const { slug } = useParams();
  const { data, isLoading, error } = useBlogPost(slug);
  const post = data?.post;

  if (isLoading) {
    return (
      <PageWrapper>
        <Spinner size="lg" className="py-32" />
      </PageWrapper>
    );
  }

  if (error || !post) {
    return (
      <PageWrapper>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-slate-900">Post Not Found</h2>
          <p className="text-slate-500 mt-2 mb-6">The article you are looking for does not exist or has been moved.</p>
          <Link to="/blog">
            <Button variant="secondary">
              <ArrowLeft size={16} className="mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title}</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content={post.coverImage?.url || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1000'} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={post.coverImage?.url || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1000'} />
      </Helmet>

      <PageWrapper className="max-w-4xl">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-colors text-sm font-semibold mb-6"
        >
          <ArrowLeft size={16} />
          Back to Articles
        </Link>

        <div className="space-y-4 mb-8">
          <div className="flex flex-wrap gap-1.5">
            {post.tags?.map((tag) => (
              <Badge key={tag} variant="blue" className="normal-case">
                #{tag}
              </Badge>
            ))}
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 font-Outfit">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar size={15} />
              {formatDate(post.publishedAt || post.createdAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <User size={15} />
              By Admin
            </span>
          </div>
        </div>

        <div className="aspect-[2/1] rounded-xl overflow-hidden bg-slate-100 border border-slate-100 shadow-sm mb-10">
          <img
            src={post.coverImage?.url || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1000'}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        <article className="markdown-content bg-white p-6 md:p-10 rounded-xl border border-slate-100 shadow-sm animate-in fade-in duration-300">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {post.content || '*No content provided.*'}
          </ReactMarkdown>
        </article>
      </PageWrapper>
    </>
  );
};
export default BlogPostPage;
