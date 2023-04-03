import axios from 'axios';

export const API_URL = 'http://localhost:80/api';

const httpApi = axios.create({
  withCredentials: true,
  baseURL: API_URL
});

httpApi.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
  return config;
});

export default httpApi;
