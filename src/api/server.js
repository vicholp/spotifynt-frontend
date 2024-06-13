import api from './index';

export default {
  index() {
    return api({
      method: 'get',
      url: 'api/server',
    });
  },
  show(serverId) {
    return api({
      method: 'get',
      url: `api/server/${serverId}`,
    });
  },
  store(server) {
    return api({
      method: 'post',
      url: 'api/server',
      data: server,
    });
  },
};
