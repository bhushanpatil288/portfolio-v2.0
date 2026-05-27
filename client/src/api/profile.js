import api from './axios.js';

export const getProfile = async () => {
  const { data } = await api.get('/profile');
  return data;
};

export const updateProfile = async (profileData) => {
  const { data } = await api.patch('/profile', profileData);
  return data;
};
