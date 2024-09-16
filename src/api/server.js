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
  tracks: {
    index(serverId) {
      return api({
        method: 'get',
        url: `api/servers/${serverId}/tracks`,
      });
    },
  },
  artists: {
    index(serverId) {
      return api({
        method: 'get',
        url: `api/servers/${serverId}/artists`,
      });
    },
  },
  releases: {
    index(serverId) {
      return api({
        method: 'get',
        url: `api/servers/${serverId}/releases`,
      });
    },
  },
  releaseGroups: {
    index(serverId) {
      return api({
        method: 'get',
        url: `api/servers/${serverId}/release-groups`,
      });
    },
  },

};
