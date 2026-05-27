import api from './axios.js';

export const getBlogPosts = async (params) => {
  const { data } = await api.get('/blog', { params });
  return data;
};

export const getBlogPostBySlug = async (slug) => {
  const { data } = await api.get(`/blog/${slug}`);
  return data;
};

export const createBlogPost = async (postData) => {
  const { data } = await api.post('/blog', postData);
  return data;
};

export const updateBlogPost = async ({ id, postData }) => {
  const { data } = await api.patch(`/blog/${id}`, postData);
  return data;
};

export const deleteBlogPost = async (id) => {
  const { data } = await api.delete(`/blog/${id}`);
  return data;
};
