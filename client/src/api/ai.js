import api from './axios.js';

export const sendChatMessage = async (messageData) => {
  const { data } = await api.post('/ai/chat', messageData);
  return data;
};
