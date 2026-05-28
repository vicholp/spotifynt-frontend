import { db, cached, expired, fresh } from './index';
import releasesApi from '@/api/release';

const defaultParams = {
  withTracks: true,
  withArtSize250x250: true,
  withArtSize500x500: true,
  withArtSize75x75: true,
  withArtSizeFull: true,
  withArtist: true,
};

async function refresh(ids) {
  const fetchedReleases = await Promise.all(ids.map(id => releasesApi.show(id, defaultParams).then(res => res.data.data)));

  const timestampedReleases = fetchedReleases.map(release => ({ ...release, cachedAt: Date.now() }));

  await db.releases.bulkPut(timestampedReleases);

  return timestampedReleases;
}


export async function getRelease(id) {
  const release = await db.releases.get(id);

  if (fresh(release)) {
    return release;
  }

  if (expired(release)) {
    refresh([id]);
    return release;
  }

  const releaseData = (await releasesApi.show(id, defaultParams))?.data?.data;

  if (releaseData) {
    releaseData.cachedAt = Date.now();
    await db.releases.put(releaseData);
  }

  return releaseData;
}

export async function getReleases(ids) {
  const cachedReleases = await db.releases.bulkGet(ids);

  const isEverythingFresh = cachedReleases.every(fresh);

  if (isEverythingFresh) {
    return cachedReleases;
  }

  const areSomeExpired = cachedReleases.every(cached);

  if (areSomeExpired) {
    const expiredIds = cachedReleases.filter(expired).map(release => release.id);

    refresh(expiredIds);

    return cachedReleases;
  }

  const missingIds = ids.filter(id => !cachedReleases.some(release => release && release.id === id));
  const releasesData = await refresh(missingIds);

  const expiredIds = cachedReleases.filter(expired).map(release => release.id);
  refresh(expiredIds);

  const validReleases = cachedReleases.filter(cached);

  const allReleases = [...validReleases, ...releasesData];
  const releaseMap = Object.fromEntries(allReleases.map(r => [r.id, r]));

  return ids.map(id => releaseMap[id]);
}
