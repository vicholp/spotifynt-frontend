import api from './index';

export default {
  index(params = {}) {
    return api({
      method: 'get',
      url: 'api/devices',
      params,
    });
  },
  show(id, params = {}) {
    return api({
      method: 'get',
      url: `api/devices/${id}`,
      params,
    });
  },
  upsert(data) {
    return api({
      method: 'post',
      url: 'api/devices',
      data,
    });
  },
  destroy(id) {
    return api({
      method: 'delete',
      url: `api/devices/${id}`,
    });
  },
};
