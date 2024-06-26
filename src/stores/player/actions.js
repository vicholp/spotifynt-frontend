import ReleaseApi from '../../api/release';
import ServerTrackApi from '../../api/serverTrack';

import ServerStore from '../server';
import MessagesStore from '../messages';

export default {
  playlistAddTrack(track) {
    this.playlist.tracks.push(track);
    this.playlist.count++;

    if (this.playlist.count === 1) {
      this.loadTrack();
    }
  },

  async playlistAddTrackById(trackId) {
    const serverStore = ServerStore();
    const serverId = serverStore.activeServer.id;
    const track = (await ServerTrackApi.show(serverId, trackId)).data.data;
    this.playlistAddTrack(track);
  },

  async playlistAddRelease(releaseId) {
    const release = (await ReleaseApi.show(releaseId, {withTracks: true})).data.data;
    const serverStore = ServerStore();
    const serverId = serverStore.activeServer.id;

    // first add the first track to the playlist,
    // for performance reasons
    let firstTrackId = release.tracks[0].id;
    this.playlistAddTrack(
      (await ServerTrackApi.show(serverId, firstTrackId)).data.data,
    );

    // then add the rest of the tracks in a async loop
    for (let i = 1; i < release.tracks.length; i++) {
      let track = release.tracks[i];
      this.playlistAddTrack(
        (await ServerTrackApi.show(serverId, track.id)).data.data,
      );
    }

    const messagesStore = MessagesStore();
    messagesStore.addedTracks(release.tracks.length);
  },

  async playlistSetIndex(int, relative) {
    if (relative) {
      this.playlist.index += int;
    } else {
      this.playlist.index = int;
    }
    if (this.playlist.index >= 0) {
      this.playlist.index %= this.playlist.count;
    } else {
      this.playlist.index = this.playlist.count + this.playlist.index;
    }
    this.loadTrack();
  },

  async loadTrack() {
    this.currentTrack = this.playlist.tracks[this.playlist.index];
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
  async playlistClear() {
    this.playlist.tracks = [];
    this.playlist.count = 0;
    this.playlist.index = 0;
    this.currentTrack = {};

    this.status.playing = false;
    this.status.time = 0;
  },
};
