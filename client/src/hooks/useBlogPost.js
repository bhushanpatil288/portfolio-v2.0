import { useQuery } from '@tanstack/react-query';
import { getBlogPostBySlug } from '../api/blog.js';

export const useBlogPost = (slug) => {
  return useQuery({
    queryKey: ['blogPost', slug],
    queryFn: () => getBlogPostBySlug(slug),
    enabled: !!slug
  });
};
