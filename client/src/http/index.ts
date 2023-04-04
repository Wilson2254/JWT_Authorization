import axios from 'axios';
import AuthService from '../services/auth-service';

export const API_URL = 'http://localhost:80/api';

const httpApi = axios.create({
  withCredentials: true,
  baseURL: API_URL
});

httpApi.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
  return config;
});

httpApi.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    console.log(error);
    const originalRequest = error.config;
    if (error.response.status === 401 && error.config && !error.config.isRetry) {
      originalRequest.isRetry = true;
      try {
        const response = await AuthService.refresh();
        localStorage.setItem('accessToken', response.data.accessToken);
        return httpApi.request(originalRequest);
      } catch (err) {
        console.log('Сессия истекла');
      }
    }
    throw error;
  }
);

export default httpApi;
