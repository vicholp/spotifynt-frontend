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

import StatsApi from '@/api/stats';

import PlayerBus from '@/bus/player';

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
    return { playerStore, serverStore };
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
    'playerStore.currentTrack'(track) {
      if (Object.keys(track).length !== 0){
        this.loadTrack(track);
      }else {
        document.title = 'spotifynt';
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

    if (Object.keys(this.playerStore.currentTrack).length === 0){
      document.title = 'spotifynt';
      return;
    }
    document.title = `${this.playerStore.currentTrack.title}`;
    this.$refs.player.src = `${this.playerStore.currentTrack.url}`; // eslint-disable-line
  },
  methods: {
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
      const url = this.getBestFile(track.files)?.url;

      this.$refs.player.src = `${url}`;
      this.$refs.playerPreloader.src = '';

      document.title = `${track.title}`;
      this.listened = false;
      this.playerStore.status.playing = false;
      this.playPause('play');
    },
    playPause(action = null) {
      if (this.$refs.player.paused || action === 'play') {
        this.playerStore.status.playing = true;
        this.$refs.player.play();
      } else if (!this.$refs.player.paused || action === 'pause') {
        this.playerStore.status.playing = false;
        this.$refs.player.pause();
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
