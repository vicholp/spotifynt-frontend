import api from './index';

export default {
  random() {
    return api({
      method: 'get',
      url: `api/recommendations`,
      params: {
        withArtSize500x500: true,
        withArtSize250x250: true,
        withArtSize75x75: true,
      },
    });
  },
  playlist(trackIds, params) {
    return api({
      method: 'post',
      url: `api/recommendations/playlist`,
      params: params,
      data: {
        trackIds,
      },
    });
  },
};
