import axios from 'axios';
import AuthService from '../services/auth-service';

export const API_URL = 'http://localhost:3000/api';

const httpApi = axios.create({
  baseURL: API_URL
});

httpApi.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
  return config;
});

let isRetryRefreshInterceptor: boolean = false;
httpApi.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && error.config && !isRetryRefreshInterceptor) {
      isRetryRefreshInterceptor = true;
      try {
        const response = await AuthService.refresh();
        localStorage.setItem('accessToken', response.data.accessToken);
        return httpApi.request(originalRequest);
      } catch (err) {
        console.log('Пользователь не авторизован');
      }
    }
    throw error;
  }
);

export default httpApi;
