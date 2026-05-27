import { useQuery } from '@tanstack/react-query';
import { getBlogPosts } from '../api/blog.js';

export const useBlogPosts = (filters = {}) => {
  return useQuery({
    queryKey: ['blog', filters],
    queryFn: () => getBlogPosts(filters)
  });
};
