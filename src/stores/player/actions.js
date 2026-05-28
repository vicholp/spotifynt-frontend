import DevicesStore from '../devices';

import { getTrack } from '../../db/tracks';


export default {
  playInThisDevice() {
    const devicesStore = DevicesStore();

    this.playingDevice = devicesStore.thisDeviceUuid;
    this.playingInThisDevice = true;
  },
  playInRemoteDevice(uuid) {
    this.playingDevice = uuid;
    this.playingInThisDevice = false;
  },
  localOnly() {
    this.localMode = true;
    localStorage.setItem('local_mode', 'true');
    this.playInThisDevice();
  },
  cloudMode() {
    this.localMode = false;
    localStorage.setItem('local_mode', 'false');
  },


  async playlistAddTrackById(trackId, source) {
    this.playlistAddTrack(await getTrack(trackId), source);
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

  async playlistRemoveIndex(int) {
    if (this.playlist.index >= int) {
      this.playlist.index -= 1;
    }
    this.playlist.tracks = this.playlist.tracks.filter((_, index) => index !== int);
    this.playlist.count--;
  },

  async loadTrack() {
    this.currentTrack = this.playlist.tracks[this.playlist.index];
  },



};
