import api from './index';

export default {
  index() {
    return api({
      method: 'get',
      url: 'api/servers',
    });
  },
  show(serverId) {
    return api({
      method: 'get',
      url: `api/servers/${serverId}`,
    });
  },
  store(server) {
    return api({
      method: 'post',
      url: 'api/servers',
      data: server,
    });
  },
};
