import api from './index';

export default {
  me() {
    return api.get('/api/users/me');
  },
};
