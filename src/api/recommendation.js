import api from './index';

export default {
  random() {
    return api({
      method: 'get',
      url: `api/recommendations/index`,
      params: {
        withArtSize250x250: true,
      },
    });
  },
};
