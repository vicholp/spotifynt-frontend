<template>
  <layout>
    <div class="container mx-auto flex flex-col gap-5 px-2">
      <img
        :src="album?.art.full"
        alt="album cover"
        class="max-w-[200px] mx-auto rounded"
      >
      <div class="mx-auto">
        <h2 class="text-xl font-bold text-center">
          {{ album?.title }}
        </h2>
        <h3 class="text-sm text-center">
          {{ album?.artist.name }}
        </h3>
      </div>

      <div class="flex flex-col gap-3 bg-white dark:bg-white dark:bg-opacity-5 pb-3 p-5 rounded">
        <div class="flex justify-between items-center">
          <h3 class=" font-bold">
            Tracks
          </h3>
          <p
            class="text-sm"
            @click="playAlbum"
          >
            play all
          </p>
        </div>
        <div class="flex flex-col  divide-y divide-white divide-opacity-5">
          <div
            v-for="track in album?.tracks"
            :key="track.id"
            class="flex py-3 items-center pr-3"
            @click="addTrack(track.id)"
          >
            {{ track.title }}
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>
<script>

import Layout from '@/layouts/main.vue';
import albumApi from '@/api/album';
import { mapStores } from 'pinia';
import usePlayerStore from '@/stores/player';

export default {

  components: {
    Layout,
  },
  data() {
    return {
      albumId: this.$route.params.albumId,
      album: null,
    };
  },
  computed: {
    ...mapStores(usePlayerStore),
  },

  async mounted() {
    const response = await albumApi.show(this.albumId, {
      withTracks: true,
    });

    this.album = response.data.data;
  },

  methods: {
    playAlbum() {
      this.playerStore.playlistClear();
      this.playerStore.playlistAddRelease(this.albumId);
    },
    addTrack(trackId) {
      this.playerStore.playlistAddTrackById(trackId);
    },
  },



};
</script>
