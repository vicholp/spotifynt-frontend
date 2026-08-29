import api from './index';

export default {
  show(recordingId, params) {
    return api({
      method: 'get',
      url: `api/recordings/${recordingId}`,
      params,
    });
  },
};
