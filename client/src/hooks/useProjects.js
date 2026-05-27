import { useQuery } from '@tanstack/react-query';
import { getProjects } from '../api/projects.js';

export const useProjects = (filters = {}) => {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: () => getProjects(filters)
  });
};
