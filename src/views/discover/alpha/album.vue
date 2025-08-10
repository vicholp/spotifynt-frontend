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
            :track="track"
            class="flex py-3 items-center pr-3"
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

import DiscoverApi from '@/api/discover';

export default {
  name: 'discover.alpha.album',
  components: {
    Layout,
  },
  data() {
    return {
      album: null,
      albumId: this.$route.params.id,
    };
  },
  async mounted() {
    const response = await DiscoverApi.alpha.album(this.albumId);
    this.album = response.data;
  },
  methods: {
    async download() {
      await DiscoverApi.alpha.downloadAlbum(this.albumId);
    },
  },
};
</script>
