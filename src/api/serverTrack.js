import api from './index';

export default {
  show(serverId, trackId) {
    return api({
      method: 'get',
      url: `api/servers/${serverId}/tracks/${trackId}`,
      params: {
        withArtSizefull: true,
        withArtSize250x250: true,
        withArtSize75x75: true,
      },
    });
  },
};
