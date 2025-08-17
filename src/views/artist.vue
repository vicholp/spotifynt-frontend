<template>
  <layout>
    <div class="container mx-auto flex flex-col gap-5 px-2">
      <div
        :key="artist?.id"
        class="col-span-6 bg-white bg-opacity-5 rounded grid grid-cols-2 gap-10 p-5"
      >
        <img
          :src="artist?.art['250x250'][0]"
          class="col-span-1 rounded-full"
        >
        <div class="flex items-center   col-span-1">
          <div class="font-medium flex flex-col gap-1">
            {{ artist?.name }}
            <div class="text-sm">
              {{ artist?.releases.length }} releases
            </div>
            <div class="text-sm">
              {{ artist?.country }}
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-3 bg-white dark:bg-white dark:bg-opacity-5 pb-3 p-5 rounded">
        <div class="flex justify-between items-center">
          <h3 class=" font-bold">
            Albums
          </h3>
        </div>
        <div class="flex flex-col  divide-y divide-white divide-opacity-5">
          <RouterLink
            v-for="album in artist?.releases"
            :key="album.id"
            :to="{ name: 'album.show', params: { albumId: album?.id } }"
            class="flex py-3 items-center pr-3 gap-3"
          >
            <img
              :src="album?.art['75x75'] ?? null"
              class="w-12 h-12 rounded"
            >
            <div>
              {{ album.title }}
            </div>
          </RouterLink>
        </div>
      </div>
      <div class="flex flex-col gap-3 bg-white dark:bg-white dark:bg-opacity-5 pb-3 p-5 rounded">
        <div class="flex justify-between items-center">
          <h3 class=" font-bold">
            Discography
          </h3>
        </div>
        <div class="flex flex-col  divide-y divide-white divide-opacity-5">
          <div
            v-for="album in artist?.releaseGroups"
            :key="album.id"
            :to="{ name: 'album.show', params: { albumId: album?.id } }"
            :class="`grid py-3 items-center pr-3 grid-cols-12
            text-white ${album.releaseCount ? 'text-opacity-100' : 'text-opacity-50'} `"
          >
            <div class="col-span-10 flex gap-1">
              <span>{{ album.title }}</span>
            </div>
            <div class="col-span-2 text-sm flex gap-1">
              {{ album.primaryType }}
              <div
                v-for="type in album.secondaryTypes"
                :key="type"
                class=""
              >
                {{ type }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>

<script>
import Layout from '@/layouts/main.vue';

import ArtistApi from '@/api/artist';
export default {
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
    const response = await ArtistApi.show(this.artistId);
    this.artist = response.data.data;
  },
};
</script>
