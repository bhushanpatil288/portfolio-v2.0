import api from './axios.js';

export const getProjects = async (params) => {
  const { data } = await api.get('/projects', { params });
  return data;
};

export const getProjectBySlug = async (slug) => {
  const { data } = await api.get(`/projects/${slug}`);
  return data;
};

export const createProject = async (projectData) => {
  const { data } = await api.post('/projects', projectData);
  return data;
};

export const updateProject = async ({ id, projectData }) => {
  const { data } = await api.patch(`/projects/${id}`, projectData);
  return data;
};

export const deleteProject = async (id) => {
  const { data } = await api.delete(`/projects/${id}`);
  return data;
};

export const getCategories = async () => {
  const { data } = await api.get('/categories');
  return data;
};

export const createCategory = async (catData) => {
  const { data } = await api.post('/categories', catData);
  return data;
};

export const updateCategory = async ({ id, catData }) => {
  const { data } = await api.patch(`/categories/${id}`, catData);
  return data;
};

export const deleteCategory = async (id) => {
  const { data } = await api.delete(`/categories/${id}`);
  return data;
};
