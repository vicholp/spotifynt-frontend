<template>
  <div
    class="w-full items-center grid grid-cols-12 p-5 rounded bg-white bg-opacity-0 hover:bg-opacity-10 transition duration-300 gap-5 "
    @click="addTrack(track.id)"
  >
    <span class="col-span-5">{{ track.title }}</span>
    <span class="col-span-5">{{ track.release.title }}</span>
    <div class="col-span-2 flex ml-auto" />
  </div>
</template>
<script>

import PlayerStore from '../stores/player';

export default {
  props: {
    track: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const playerStore = PlayerStore();
    return { playerStore };
  },
  methods: {
    addTrack(trackId) {
      this.playerStore.playlistAddTrackById(trackId);
    },
  },
};
</script>
