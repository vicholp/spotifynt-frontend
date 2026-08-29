<template>
  <layout>
    <div class="container mx-auto flex flex-col gap-5 px-2">
      <div class="flex bg-white dark:bg-opacity-5 pl-3 items-center rounded gap-3 shadow dark:shadow-none">
        <span
          class="iconify text-lg"
          data-icon="mdi:youtube"
        />
        <input
          ref="search"
          v-model="query"
          type="text"
          class="bg-white bg-opacity-0 w-full border-0 h-12 p-0 px-3 dark:focus:bg-opacity-10 dark:focus:ring-0 rounded-r"
          placeholder="search"
          @input="sendQuery"
          @keyup.enter.prevent="$refs.search.blur()"
        >
      </div>
      <div class="flex flex-col gap-6 bg-white dark:bg-white dark:bg-opacity-5 pb-3 p-5 rounded">
        <div class="flex gap-4 font-bold">
          Artists
        </div>
        <RouterLink
          v-for="artist in queryResults?.alpha?.artists"
          :key="artist.id"
          :to="{ name: 'discover.alpha.artist', params: { id: artist?.browseId ?? artist?.artists[0]?.id } }"
          class="flex items-center gap-4"
        >
          <img
            :src="artist?.thumbnails[0]?.url || artist?.artists[0]?.thumbnails[0]?.url"
            alt="artist cover"
            class="inline-block w-12 h-12 rounded-full"
          >
          {{ artist?.artist || artist?.artists[0]?.name }}
        </RouterLink>
      </div>
      <div class="flex flex-col gap-6 bg-white dark:bg-white dark:bg-opacity-5 pb-3 p-5 rounded">
        <div class="flex gap-4 font-bold">
          Albums
        </div>
        <RouterLink
          v-for="album in queryResults?.alpha?.albums"
          :key="album?.id"
          :to="{ name: 'discover.alpha.album', params: { id: album?.browseId ?? album?.id} }"
          class="flex items-center gap-4"
        >
          <img
            :src="album?.thumbnails[0]?.url"
            alt="album cover"
            class="inline-block w-12 h-12 rounded-full"
          >
          {{ album.title }}
        </RouterLink>
      </div>
      <div class="flex flex-col gap-6 bg-white dark:bg-white dark:bg-opacity-5 pb-3 p-5 rounded">
        <div class="flex gap-4 font-bold">
          Tracks
        </div>
        <div
          v-for="song in queryResults?.alpha?.songs"
          :key="song?.id"
          class="flex items-center gap-4"
          @click="handleTrack(song)"
        >
          <img
            :src="song?.thumbnails[0]?.url"
            alt="album cover"
            class="inline-block w-12 h-12 rounded-full"
          >
          {{ song.title }}
        </div>
      </div>
    </div>
  </layout>
</template>

<script>

import Layout from '@/layouts/main.vue';
import DiscoverApi from '@/api/discover';

export default {
  components: {
    Layout,
  },
  data() {
    return {
      query: this.$route.query.initialQuery || '',
      queryResults: null,
      timeout: null,
      loading: false,
    };
  },
  mounted() {
    if (this.query !== '') {
      this.fetchQueryResults();
    }
  },
  methods: {
    async handleTrack(song) {
      await DiscoverApi.alpha.downloadTrack(this.albumId, song.videoId);
    },

    async sendQuery() {
      if (this.query === '') {
        this.queryResults = null;
        return;
      }

      try {
        if (this.timeout) {
          clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => {
          this.fetchQueryResults();
        }, 300); // Adjust the delay as needed
      } catch (error) {
        //
      }
    },

    async fetchQueryResults() {
      if (this.query === '') {
        this.queryResults = null;
        return;
      }

      this.queryResults = null;
      this.loading = true;

      try {
        const response = await DiscoverApi.query({q: this.query});
        this.queryResults = response.data;
      } catch (error) {
        this.queryResults = null;
      }

      this.loading = false;
      this.$router.replace({ query: { initialQuery: this.query } });
    },
  },
};

</script>
