import { defineStore } from 'pinia';

import actions from './actions';

import { useEvents } from '@/composables/events';
import { RecordingAddedToQueueEvent, QueueShuffledEvent, QueueClearedEvent, ReleaseAddedToQueueEvent } from '@/schemas/events';

import { getTrack, getTracks } from '../../db/tracks';
import { getRelease } from '../../db/releases';

import MessagesStore from '../messages';
import { ref } from 'vue';

export default defineStore(
  'player',
  () => {
    const currentTrack = ref({});
    const playlist = ref({
      tracks: [],
      count: 0,
      index: 0,
    });
    const status = ref({
      playing: false,
      time: 0,
    });
    const playingDevice = ref(null);
    const playingInThisDevice = ref(false);
    const localMode = ref(false);
    const initialized = ref(false);


    const { storeEvent } = useEvents();

    function playlistAddTrack(track, source = null, group = null) {
      this.playlist.tracks.push(track);
      this.playlist.count++;

      if (this.playlist.count === 1) {
        this.loadTrack();
      }

      storeEvent(RecordingAddedToQueueEvent.parse({
        payload: {
          recordingId: track.id,
          source,
          group,
        },
      }));
    }

    function playlistShuffle() {
      const tracks = this.playlist.tracks;

      let currentTrack = tracks[this.playlist.index];
      let remainingTracks = tracks.filter((_, index) => index !== this.playlist.index);

      for (let i = remainingTracks.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [remainingTracks[i], remainingTracks[j]] = [remainingTracks[j], remainingTracks[i]];
      }

      this.playlist.tracks = [
        ...remainingTracks.slice(0, this.playlist.index),
        currentTrack,
        ...remainingTracks.slice(this.playlist.index),
      ];

      storeEvent(QueueShuffledEvent.parse({
        payload: {},
      }));
    }

    async function playlistClear() {
      this.playlist.tracks = [];
      this.playlist.count = 0;
      this.playlist.index = 0;
      this.currentTrack = {};

      this.status.playing = false;
      this.status.time = 0;

      storeEvent(QueueClearedEvent.parse({
        payload: {},
      }));
    }

    async function playlistAddRelease(releaseId, source = null, group = null) {
      const release = await getRelease(releaseId);

      // first add the first track to the playlist,
      // for performance reasons
      this.playlistAddTrack(await getTrack(release.tracks[0].id), source, group);


      // then add the rest of the tracks in a async loop
      (await getTracks(release.tracks.slice(1).map(track => track.id))).map(track => this.playlistAddTrack(track, source, group));

      const messagesStore = MessagesStore();
      messagesStore.addedTracks(release.tracks.length);

      storeEvent(ReleaseAddedToQueueEvent.parse({
        payload: {
          releaseId,
          source,
        },
      }));
    }

    function getNextTrack() {
      let index = this.playlist.index;
      index++;

      if (index >= 0) {
        index %= this.playlist.count;
      } else {
        index = this.playlist.count + index;
      }

      return this.playlist.tracks[index];
    }


    return {
      playlistAddRelease,
      playlistAddTrack,
      playlistShuffle,
      playlistClear,
      currentTrack,
      playlist,
      status,
      playingDevice,
      playingInThisDevice,
      localMode,
      initialized,
      getNextTrack,
      ...actions,
    };
  },
  {
    persist: false,
  },
);
