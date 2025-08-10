import api from './index';

export default {
  show(releaseId, params) {
    return api({
      method: 'get',
      url: `api/tracks/${releaseId}`,
      params,
    });
  },
};
