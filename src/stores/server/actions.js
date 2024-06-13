export default {
  getActiveServerPath() {
    if (this.activeServer.path == 'http://beets:9003') {
      return `http://localhost:9003`;
    }

    return this.activeServer.path;
  },
};
