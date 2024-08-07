import api from './index';

export default {
  index(search){
    return api({
      method: 'get',
      url: `api/search?q=${search}`,
      params: {
        withArtSize250x250: true,
      },
    });
  },
};
