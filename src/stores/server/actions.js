export default {
  getActiveServerPath() {
    if (this.activeServer.path == 'http://beets:9090') {
      return `http://localhost:9090`;
    }

    return this.activeServer.path;
  },
};
