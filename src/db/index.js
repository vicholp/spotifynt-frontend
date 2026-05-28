import { Dexie } from 'dexie';

const TTL = 1000 * 60 * 60 * 24 * 7; // 7 days

export const cached = (record) => {
  return record && record.cachedAt;
};

export const expired = (record) => {
  return record && Date.now() - record?.cachedAt >= TTL;
};

export const fresh = (record) => {
  return record && Date.now() - record?.cachedAt < TTL;
};

export const db = new Dexie('spotifynt');
db.version(1).stores({
  releases: 'id',
  artists: 'id',
  arts: 'id',
  tracks: 'id',
});
