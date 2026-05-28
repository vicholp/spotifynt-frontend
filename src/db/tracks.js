import { db, cached, expired, fresh } from './index';
import tracksApi from '@/api/track';

const defaultParams = {
  withFiles: true,
  withRelease: true,
  withArtSize250x250: true,
  withArtSize500x500: true,
  withArtSize75x75: true,
  withArtSizeFull: true,
  withArtist: true,
};

async function refresh(ids) {
  const fetchedTracks = await Promise.all(ids.map(id => tracksApi.show(id, defaultParams).then(res => res.data.data)));

  const timestampedTracks = fetchedTracks.map(track => ({ ...track, cachedAt: Date.now() }));

  await db.tracks.bulkPut(timestampedTracks);

  return timestampedTracks;
}

export async function getTrack(id) {
  const track = await db.tracks.get(id);

  if (fresh(track)) {
    return track;
  }

  if (expired(track)) {
    refresh([id]);
    return track;
  }

  const trackData = (await tracksApi.show(id, defaultParams))?.data?.data;

  if (trackData) {
    trackData.cachedAt = Date.now();
    await db.tracks.put(trackData);
  }

  return trackData;
}

export async function getTracks(ids) {
  const cachedTracks = await db.tracks.bulkGet(ids);

  const isEverythingFresh = cachedTracks.every(fresh);

  if (isEverythingFresh) {
    return cachedTracks;
  }

  const areSomeExpired = cachedTracks.every(cached);

  if (areSomeExpired) {
    const expiredIds = cachedTracks.filter(expired).map(track => track.id);

    refresh(expiredIds);

    return cachedTracks;
  }

  const validTracks = cachedTracks.filter(cached);

  const missingIds = ids.filter(id => !cachedTracks.some(track => track && track.id === id));

  const tracksData = await refresh(missingIds);

  const expiredIds = cachedTracks.filter(expired).map(track => track.id);

  refresh(expiredIds);

  const allTracks = [...validTracks, ...tracksData];

  const trackMap = Object.fromEntries(allTracks.map(t => [t.id, t]));

  return ids.map(id => trackMap[id]);
}
