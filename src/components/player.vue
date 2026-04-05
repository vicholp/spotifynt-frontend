<template>
  <div
    class="w-full"
    @keyup.enter="playPause()"
  >
    <audio
      ref="player"
      preload="auto"
      @ended="nextTrack()"
      @loadedmetadata="loadMetadata"
      @timeupdate="checkPlayed"
      @canplaythrough="loadNextTrack"
      @waiting="loading = true"
      @playing="loading = false"
    />
    <audio
      ref="playerPreloader"
      preload="auto"
    />
  </div>
</template>
<script>
import PlayerStore from '@/stores/player';
import ServerStore from '@/stores/server';
import DevicesStore from '@/stores/devices';
import UserStore from '@/stores/user';

import StatsApi from '@/api/stats';

import PlayerBus from '@/bus/player';

import {useEcho, echo } from "@laravel/echo-vue";
import { camelizeKeys } from 'humps';


const TIME_AFTER_LISTENED = 240; // [s]
const PROGRESS_AFTER_LISTENED = 0.5; // [%]

const INT_MAX = 999999999;

export default {
  props: {
    authUser: {
      default: () => {},
      type: Object,
    },
  },

  setup() {
    const playerStore = PlayerStore();
    const serverStore = ServerStore();
    const devicesStore = DevicesStore();
    const userStore = UserStore();

    try{
      const userId = userStore.user.id;

      useEcho(`App.Models.UserPlayingStatus.${userId}`, "UserPlayingStatusUpdatedEvent", (e) => {
        const playerStateOld = e.player_state;
        const playerState = camelizeKeys(playerStateOld);

        const playingInThisDevice = playerState.playingDevice === devicesStore.thisDeviceUuid;

        console.log('Received playing status update from Echo:', playerState);

        if (playerStore.localMode) {
          console.log('Received playing status update from server, but ignoring it because local mode is enabled');
          return;
        }

        playerStore.$patch({
          ...playerState,
          initialized: true,
          playingInThisDevice,
        });
      });

      window.echo = echo;
    } catch (error) {
      console.error('Error setting up Echo:', error);
    }

    return { playerStore, serverStore, userStore };
  },
  data() {
    return {
      stats: {
        listened: false,
      },
      totalTime: 0,
      currentTime: 0,
      progressPercent: 0,
      listened: false,
      loading: false,
      playerOverlay: false,
    };
  },
  watch: {
    'playerStore.currentTrack.id'() {
      const track = this.playerStore.currentTrack;
      console.debug('Current track changed:', track);
      if (Object.keys(track).length !== 0){
        this.loadTrack(track);
      }else {
        this.clearTrack();
      }
    },
    'playerStore.status.playing'(playing) {
      console.debug('Playing status changed:', playing);
      if (playing) {
        if (this.playerStore.playingInThisDevice) {
          this.$refs.player.play();
        }
      } else {
        if (this.playerStore.playingInThisDevice) {
          this.$refs.player.pause();
        }
      }
    },
    'playerStore.initialized'(initialized) {
      if (initialized) {
        this.initialLoad();
      }
    },
    'playerStore.playingInThisDevice'(playingInThisDevice) {
      console.debug('Playing in this device changed:', playingInThisDevice);
      if (playingInThisDevice) {
        this.initialLoad();
      } else{
        this.playerStore.status.playing = false;
        this.clearTrack();
      }
    },
  },
  beforeMount() {
    PlayerBus.off("next", this.nextTrack);
    PlayerBus.off("previous", this.previousTrack);
    PlayerBus.off("playpause", this.playPause);
  },
  mounted() {
    PlayerBus.on("next", this.nextTrack);
    PlayerBus.on("previous", this.previousTrack);
    PlayerBus.on("playpause", this.playPause);
  },
  methods: {
    initialLoad() {
      if (Object.keys(this.playerStore.currentTrack).length === 0){
        document.title = 'spotifynt';
        return;
      }

      const currentTrack = this.playerStore.currentTrack;

      if (currentTrack && Object.keys(currentTrack).length !== 0) {
        document.title = `${this.playerStore.currentTrack.title}`;
        if (this.playerStore.playingInThisDevice) {
          this.$refs.player.src = this.getBestFile(this.playerStore.currentTrack.files)?.url;
          this.playerStore.status.playing = false;
        }
      }
    },
    getBestFile(files) {
      const extensionOrder = {
        '.flac': 0,
        '.mp3': 1,
      };

      const sourceOrder = {
        'user_upload': 0,
        'alpha_plugin': 1,
      };

      return files.sort((a, b) => {
        const extA = extensionOrder[a.extension] ?? INT_MAX;
        const extB = extensionOrder[b.extension] ?? INT_MAX;
        if (extA !== extB) {
          return extA - extB;
        }
        const srcA = sourceOrder[a.source] ?? INT_MAX;
        const srcB = sourceOrder[b.source] ?? INT_MAX;
        return srcA - srcB;
      })[0];
    },
    clearTrack() {
      document.title = 'spotifynt';
      this.$refs.player.src = ``;
      this.$refs.playerPreloader.src = ``;
    },
    loadNextTrack() {
      const nextTrack = this.playerStore.getNextTrack;

      const url = this.getBestFile(nextTrack.files)?.url;

      this.$refs.playerPreloader.src = `${url}`; // eslint-disable-line
    },
    loadMetadata(event) {
      this.totalTime = event.target.duration;
    },
    loadTrack(track) {
      console.debug('Loading track...', track.title);
      const url = this.getBestFile(track.files)?.url;

      if (this.playerStore.playingInThisDevice) {
        this.$refs.player.src = `${url}`;
        this.$refs.playerPreloader.src = '';
      }

      document.title = `${track.title}`;
      this.listened = false;
      this.playerStore.status.playing = false;
      this.playPause('play');
    },
    playPause(action = null) {
      if (!this.playerStore.status.playing || action === 'play') {
        this.playerStore.status.playing = true;
        if (this.playerStore.playingInThisDevice) {
          this.$refs.player.play();
        }
      } else if (this.playerStore.status.playing || action === 'pause') {
        this.playerStore.status.playing = false;

        if (this.playerStore.playingInThisDevice) {
          this.$refs.player.pause();
        }
      }
      this.loadMediaMetadata(this.playerStore.currentTrack);
    },
    nextTrack() {
      this.playerStore.playlistSetIndex(1, true);
    },
    previousTrack() {
      this.playerStore.playlistSetIndex(-1, true);
    },
    checkPlayed(event) {
      const progress = event.target.currentTime / this.totalTime;

      this.progressPercent = progress * 100;
      if (
        this.listened === false &&
        (progress > PROGRESS_AFTER_LISTENED || event.target.currentTime > TIME_AFTER_LISTENED)
      ) {
        this.listened = true;

        let data = {
          trackId: this.playerStore.currentTrack.id,
          userId: this.authUser.id,
          serverId: this.serverStore.activeServer.id,
          releaseId: this.playerStore.currentTrack.release.id,
        };
        StatsApi.playedTrack(data);
      }
      if (this.playerStore.status.playing === false && event.target.currentTime > 1) {
        // StatsApi.nowPlaying(this.actual.id);
      }
    },
    loadMediaMetadata(track) {
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: track.title,
          artist: 'spotifynt',
          album: track.release.title,
          artwork: [
            { src: track.release.art['250x250'], sizes: '250x250', type: 'image/webp' },
            { src: track.release.art['75x75'], sizes: '75x75', type: 'image/webp' },
          ],
        });

        navigator.mediaSession.setActionHandler('play', () => this.playPause('play'));
        navigator.mediaSession.setActionHandler('pause', () => this.playPause('pause'));
        navigator.mediaSession.setActionHandler('previoustrack', () => this.previousTrack());
        navigator.mediaSession.setActionHandler('nexttrack', () => this.nextTrack());
      }
    },
  },
};
</script>
