import api from './index';

export default {
  show(id, params = {}) {
    return api({
      method: 'get',
      url: `api/releases/${id}`,
      params: {
        withArtSizefull: true,
        withArtSize500x500: true,
        withArtSize250x250: true,
        withArtSize75x75: true,
        withTracks: true,
        ...params,
      },
    });
  },
};
