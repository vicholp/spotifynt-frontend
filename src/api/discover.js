import api from './index';

export default {
  query(params) {
    return api({
      method: 'get',
      url: `api/discover`,
      params,
    });
  },
  alpha: {
    artist(id) {
      return api({
        method: 'get',
        url: `api/alpha/artist/${id}`,
      });
    },
    album(id) {
      return api({
        method: 'get',
        url: `api/alpha/album/${id}`,
      });
    },
    downloadAlbum(id) {
      return api({
        method: 'post',
        url: `api/alpha/album/${id}/download`,
      });
    },
  },
};
