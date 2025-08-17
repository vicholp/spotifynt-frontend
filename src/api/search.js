import api from './index';

export default {
  index(search) {
    return api({
      method: 'get',
      url: `api/search?q=${search}`,
      params: {
        withArtSize500x500: true,
        withArtSize250x250: true,
        withRelease: true,
        withReleases: true,
      },
    });
  },
};
