<template>
  <layout>
    <div class="container mx-auto flex flex-col gap-5 px-2">
      <img
        :src="artist?.thumbnails[0]?.url"
        alt="album cover"
        class="max-w-[200px] mx-auto rounded"
      >
      <div class="mx-auto">
        <h2 class="text-xl font-bold text-center">
          {{ artist?.name }}
        </h2>
      </div>

      <div class="flex flex-col gap-3 bg-white dark:bg-white dark:bg-opacity-5 pb-3 p-5 rounded">
        <div class="flex justify-between items-center">
          <h3 class=" font-bold">
            Albums
          </h3>
        </div>
        <div class="flex flex-col  divide-y divide-white divide-opacity-5">
          <RouterLink
            v-for="album in artist?.albums?.results"
            :key="album.id"
            :to="{ name: 'discover.alpha.album', params: { id: album?.browseId } }"
            class="flex py-3 items-center pr-3"
          >
            {{ album.title }}
          </RouterLink>
        </div>
      </div>
    </div>
  </layout>
</template>

<script>
import Layout from '@/layouts/main.vue';

import DiscoverApi from '@/api/discover';

export default {
  name: 'discover.alpha.artist',
  components: {
    Layout,
  },
  data() {
    return {
      artist: null,
      artistId: this.$route.params.id,
    };
  },
  async mounted() {
    const response = await DiscoverApi.alpha.artist(this.artistId);
    this.artist = response.data;
  },
};
</script>
