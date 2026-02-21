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
    artist(id, params) {
      return api({
        method: 'get',
        url: `api/alpha/artist/${id}`,
        params,
      });
    },
    album(id, params) {
      return api({
        method: 'get',
        url: `api/alpha/album/${id}`,
        params,
      });
    },
    downloadAlbum(id, params) {
      return api({
        method: 'post',
        url: `api/alpha/album/${id}/download`,
        params,
      });
    },
    downloadTrack(albumId, trackId, params) {
      return api({
        method: 'post',
        url: `api/alpha/album/${albumId}/track/${trackId}/download`,
        params,
      });
    },
  },
};
