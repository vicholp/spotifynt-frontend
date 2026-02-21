import api from './index';

export default {
  me: {
    getPlayingStatus(params) {
      return api.get('/api/me/playing-status', { params });
    },
    setPlayingStatus(data) {
      return api.post('/api/me/playing-status', data);
    },
  },
};
