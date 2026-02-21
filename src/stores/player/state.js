export default () => ({
  currentTrack: {},
  playlist: {
    tracks: [],
    count: 0,
    index: 0,
  },
  status: {
    playing: false,
    time: 0,
  },
  playingDevice: null,
  playingInThisDevice: false,
  localMode: false,
  initialized: false,
});
