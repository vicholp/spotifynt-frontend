<template>
  <layout>
    <div class="container mx-auto flex flex-col gap-5 px-2">
      <img
        :src="album?.thumbnails[2]?.url"
        alt="album cover"
        class="max-w-[200px] mx-auto rounded"
      >
      <div class="mx-auto">
        <h2 class="text-xl font-bold text-center">
          {{ album?.title }}
        </h2>
        <RouterLink
          class="text-sm text-center"
          :to="{ name: 'discover.alpha.artist', params: { id: album?.artist?.id ?? album?.artists[0]?.id } }"
        >
          {{ album?.artist?.name ?? album?.artists[0]?.name }}
        </RouterLink>
      </div>

      <div
        class=" flex flex-col gap-3 bg-white dark:bg-white dark:bg-opacity-5 pb-3 p-5 rounded"
      >
        <div class="flex justify-between items-center">
          <h3 class=" font-bold">
            Songs
          </h3>
          <div
            class="text-sm cursor-pointer flex gap-1"
            @click="download"
          >
            <span
              class="iconify text-lg"
              data-icon="mdi:download"
            />
            Download
          </div>
        </div>
        <div class="flex flex-col  divide-y divide-white divide-opacity-5">
          <div
            v-for="track in album?.tracks"
            :key="track.id"
            class="flex py-3 items-center pr-3 gap-3"
          >
            <div>
              {{ track.title }}
            </div>
            <div class="text-sm" v-if="isReadyToListen(track)" @click="addTrack(track)">
              listen
            </div>
            <div class="text-sm" v-else @click="downloadTrack(track.videoId)">
              download
            </div>
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>


<script>
import Layout from '@/layouts/main.vue';

import DiscoverApi from '@/api/discover';
import PlayerStore from '@/stores/player';


export default {
  name: 'discover.alpha.album',
  components: {
    Layout,
  },
  data() {
    return {
      album: null,
      albumId: this.$route.params.id,
      pendingDownloads: []

    };
  },
  setup() {
    const playerStore = PlayerStore();
    return { playerStore };
  },
  async mounted() {
    const response = await DiscoverApi.alpha.album(this.albumId, { withFiles: true});
    this.album = response.data;
  },
  methods: {
    async download() {
      await DiscoverApi.alpha.downloadAlbum(this.albumId);
    },
    isReadyToListen(track) {
      return track?.spotifyntTrack?.files?.length > 0;
    },
    async downloadTrack(trackId) {
      await DiscoverApi.alpha.downloadTrack(this.albumId, trackId);

      this.pendingDownloads.push(trackId);

    },
    addTrack(track) {
      const trackId = track?.spotifyntTrack?.id;
      this.playerStore.playlistAddTrackById(trackId);
    },
  },
};
</script>
