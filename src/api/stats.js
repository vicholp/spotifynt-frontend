import api from './index';

export default {
  playedTrack(userId, serverId, trackId) {
    return api({
      method: 'post',
      url: `api/stats/playedTrack`,
      data: {
        userId,
        serverId,
        trackId,
      },
    });
  },
};
