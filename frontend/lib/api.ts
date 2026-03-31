import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  const apiKey = Cookies.get('apiKey');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // If your auth uses bearer
  }
  
  if (apiKey) {
    config.headers['X-API-KEY'] = apiKey; // API key is required for rate limit filter
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined' && !window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
