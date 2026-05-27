import { useQuery } from '@tanstack/react-query';
import { getProjectBySlug } from '../api/projects.js';

export const useProject = (slug) => {
  return useQuery({
    queryKey: ['project', slug],
    queryFn: () => getProjectBySlug(slug),
    enabled: !!slug
  });
};
