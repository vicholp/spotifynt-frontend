<template>
  <layout>
    <div class="container mx-auto flex flex-col gap-5 px-2">
      <!-- Release Header -->
      <div
        v-if="release && !loading"
        class="bg-white dark:bg-opacity-5 rounded shadow dark:shadow-none p-6"
      >
        <div class="flex items-center gap-6">
          <div class="w-32 h-32 bg-white bg-opacity-10 rounded flex items-center justify-center">
            <img
              v-if="release.art && release.art['250x250']"
              :src="release.art['250x250']"
              :alt="release.title"
              class="w-full h-full object-cover rounded"
            >
            <span
              v-else
              class="iconify text-5xl text-white text-opacity-70"
              data-icon="mdi:album"
            />
          </div>
          <div class="flex-1">
            <h1 class="text-3xl font-bold text-white mb-2">
              {{ release.title }}
            </h1>
            <p class="text-xl text-white text-opacity-90 mb-1">
              {{ release.artist?.name || 'Unknown Artist' }}
            </p>
            <div class="flex items-center gap-4 text-white text-opacity-70">
              <span v-if="release.year">{{ release.year }}</span>
              <span v-if="release.releaseType">{{ release.releaseType }}</span>
              <span v-if="tracks.length">{{ tracks.length }} track{{ tracks.length !== 1 ? 's' : '' }}</span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button
              class="px-6 py-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition duration-300 text-white font-medium"
              @click="playRelease"
            >
              <span
                class="iconify mr-2"
                data-icon="mdi:play"
              />
              Play Release
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div
        v-if="loading"
        class="bg-white dark:bg-opacity-5 rounded shadow dark:shadow-none p-8 text-center text-white text-opacity-70"
      >
        Loading release...
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-white dark:bg-opacity-5 rounded shadow dark:shadow-none p-8 text-center text-white text-opacity-70"
      >
        Release not found
      </div>

      <!-- Tracks -->
      <div
        v-else-if="tracks.length > 0"
        class="bg-white dark:bg-opacity-5 rounded shadow dark:shadow-none"
      >
        <div class="p-6 border-b border-white border-opacity-10">
          <h2 class="text-xl font-semibold text-white">
            Tracks
          </h2>
        </div>
        <div class="divide-y divide-white divide-opacity-10">
          <div
            v-for="(track, index) in tracks"
            :key="track.id"
            class="flex items-center p-4 hover:bg-white hover:bg-opacity-5 transition duration-300 cursor-pointer"
            @click="playTrack(track.id)"
          >
            <div class="w-8 text-center text-white text-opacity-70 text-sm">
              {{ index + 1 }}
            </div>
            <div class="flex-1 mx-4">
              <h3 class="text-white font-medium">
                {{ track.title }}
              </h3>
              <p
                v-if="track.duration"
                class="text-sm text-white text-opacity-70"
              >
                {{ formatDuration(track.duration) }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <button
                class="p-2 rounded hover:bg-white hover:bg-opacity-10 transition duration-300"
                @click.stop="playTrack(track.id)"
              >
                <span
                  class="iconify text-white text-opacity-70 hover:text-opacity-100"
                  data-icon="mdi:play"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- No Tracks -->
      <div
        v-else-if="!loading && release"
        class="bg-white dark:bg-opacity-5 rounded shadow dark:shadow-none p-8 text-center text-white text-opacity-70"
      >
        No tracks found for this release
      </div>
    </div>
  </layout>
</template>

<script>
import Layout from '@/layouts/main.vue';
import AlbumApi from '@/api/album';
import PlayerStore from '@/stores/player';

export default {
  components: {
    Layout,
  },
  setup() {
    const playerStore = PlayerStore();
    return { playerStore };
  },
  data() {
    return {
      release: null,
      tracks: [],
      loading: true,
      error: false,
    };
  },
  async mounted() {
    await this.loadRelease();
  },
  methods: {
    async loadRelease() {
      try {
        this.loading = true;
        this.error = false;
        const albumId = this.$route.params.albumId;
        const response = await AlbumApi.show(albumId);
        const data = response.data.data || response.data;

        this.release = data;
        this.tracks = data.tracks || [];
      } catch (error) {
        this.error = true;
        this.release = null;
        this.tracks = [];
      } finally {
        this.loading = false;
      }
    },
    playRelease() {
      if (this.release) {
        this.playerStore.playlistAddRelease(this.release.id);
      }
    },
    playTrack(trackId) {
      this.playerStore.playlistAddTrackById(trackId);
    },
    formatDuration(seconds) {
      if (!seconds) return '';
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    },
  },
};
</script>
