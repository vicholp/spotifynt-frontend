import api from './index';

export default {
  index() {
    return api({
      method: 'get',
      url: 'api/artists',
      params: {
        withReleaseCount: true,
      },
    });
  },
  show(id, params = {}) {
    return api({
      method: 'get',
      url: `api/artists/${id}`,
      params: {
        withArtSizefull: true,
        withArtSize500x500: true,
        withArtSize250x250: true,
        withArtSize75x75: true,
        withReleases: true,
        withReleaseGroups: true,
        withReleaseCount: true,
        ...params,
      },
    });
  },
};
