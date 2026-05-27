import api from './axios.js';

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const { data } = await api.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

export const deleteImage = async (publicId) => {
  const encodedId = encodeURIComponent(publicId);
  const { data } = await api.delete(`/upload/image/${encodedId}`);
  return data;
};
