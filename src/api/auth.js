import api from './index';

export default {
  csrfCookie() {
    return api.get('/sanctum/csrf-cookie');
  },
  login(data) {
    return api.post('/login', data);
  },
  logout() {
    return api.post('/logout');
  },
  register(data) {
    return api.post('/register', data);
  },
  me() {
    return api.get('/api/users/me');
  },
};
