import api from './index';

export default {
  storeEvents(events) {
    return api({
      method: 'post',
      url: 'api/events/batch',
      data: { events },
    });
  },
};
