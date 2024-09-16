import axios from 'axios';
import { camelizeKeys, decamelizeKeys } from 'humps';
import router from '@/router';

const api = axios.create();

api.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

api.defaults.withCredentials = true;
api.defaults.withXSRFToken = true;

api.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

api.interceptors.response.use(
  response => {
    if (response.data && response.headers['content-type'].match('application/json')) {
      response.data = camelizeKeys(response.data);
    }

    return response;
  },
  error => {
    if (error.response.status === 401) {
      router.push({ name: 'auth.login' });
    }

    return Promise.reject(error);
  },
);

api.interceptors.request.use(config => {
  const newConfig = { ...config };
  if (newConfig.headers['Content-Type'] === 'multipart/form-data') {
    return newConfig;
  }
  if (config.params) {
    newConfig.params = decamelizeKeys(config.params);
  }
  if (config.data) {
    newConfig.data = decamelizeKeys(config.data);
  }

  return newConfig;
});

export default api;
