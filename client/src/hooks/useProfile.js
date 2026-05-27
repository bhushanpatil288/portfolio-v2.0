import { useQuery } from '@tanstack/react-query';
import { getProfile } from '../api/profile.js';

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfile
  });
};
