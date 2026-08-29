import { defineStore } from 'pinia';

export default defineStore('playlist', {
  state: () => ({
    playlist: [],
    index: null,
  }),
  actions: {
    setPlaylist(playlist) {
      this.playlist = playlist;
      this.index = 0;
    },
    setIndex(index) {
      if (index < 0 || index >= this.playlist.length) {
        return;
      }
      this.index = index;
    },
    moveIndex(offset) {
      let newIndex = (this.index + offset) % this.playlist.length;

      newIndex = newIndex < 0 ? newIndex + this.playlist.length : newIndex;

      this.setIndex(newIndex);
    },
    playlistAddTracks(tracks) {
      this.playlist.push(...tracks);
    },
    playlistClear() {
      this.playlist = [];
      this.index = null;
    },
    playlistShuffle() {
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
    },
  },
});
