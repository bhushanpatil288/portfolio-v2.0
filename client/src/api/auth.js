import api from './axios.js';

export const loginAdmin = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials);
  console.log(data)
  return data;
};

export const fetchMe = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};

export const logoutAdmin = async () => {
  const { data } = await api.post('/auth/logout');
  return data;
};
