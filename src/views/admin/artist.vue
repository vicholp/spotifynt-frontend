<template>
  <layout>
    <div class="container mx-auto flex flex-col gap-5 px-2">
      <!-- Artist Header -->
      <div
        v-if="artist && !loading"
        class="bg-white dark:bg-opacity-5 rounded shadow dark:shadow-none p-6"
      >
        <div class="flex items-center gap-6">
          <div class="w-24 h-24 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
            <span
              class="iconify text-4xl text-white text-opacity-70"
              data-icon="mdi:account-music"
            />
          </div>
          <div class="flex-1">
            <h1 class="text-3xl font-bold text-white mb-2">
              {{ artist.name }}
            </h1>
            <p class="text-white text-opacity-70">
              {{ releases.length }} release{{ releases.length !== 1 ? 's' : '' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div
        v-if="loading"
        class="bg-white dark:bg-opacity-5 rounded shadow dark:shadow-none p-8 text-center text-white text-opacity-70"
      >
        Loading artist...
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-white dark:bg-opacity-5 rounded shadow dark:shadow-none p-8 text-center text-white text-opacity-70"
      >
        Artist not found
      </div>

      <!-- Releases -->
      <div
        v-else-if="releases.length > 0"
        class="bg-white dark:bg-opacity-5 rounded shadow dark:shadow-none"
      >
        <div class="p-6 border-b border-white border-opacity-10">
          <h2 class="text-xl font-semibold text-white">
            Releases
          </h2>
        </div>
        <div class="divide-y divide-white divide-opacity-10">
          <div
            v-for="release in releases"
            :key="release.id"
            class="flex items-center justify-between p-4 hover:bg-white hover:bg-opacity-5 transition duration-300 cursor-pointer"
            @click="goToAlbum(release.id)"
          >
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 bg-white bg-opacity-10 rounded flex items-center justify-center">
                <img
                  v-if="release.art && release.art['75x75']"
                  :src="release.art['75x75']"
                  :alt="release.title"
                  class="w-full h-full object-cover rounded"
                >
                <span
                  v-else
                  class="iconify text-2xl text-white text-opacity-70"
                  data-icon="mdi:album"
                />
              </div>
              <div>
                <h3 class="text-white font-medium">
                  {{ release.title }}
                </h3>
                <p class="text-sm text-white text-opacity-70">
                  {{ release.releaseType || 'Album' }}
                  <span v-if="release.year">
                    • {{ release.year }}
                  </span>
                  <span v-if="release.trackCount">
                    • {{ release.trackCount }} track{{ release.trackCount !== 1 ? 's' : '' }}
                  </span>
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button
                class="p-2 rounded hover:bg-white hover:bg-opacity-10 transition duration-300"
                @click.stop="playRelease(release.id)"
              >
                <span
                  class="iconify text-white text-opacity-70 hover:text-opacity-100"
                  data-icon="mdi:play"
                />
              </button>
              <span
                class="iconify text-white text-opacity-40"
                data-icon="mdi:chevron-right"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- No Releases -->
      <div
        v-else-if="!loading && artist"
        class="bg-white dark:bg-opacity-5 rounded shadow dark:shadow-none p-8 text-center text-white text-opacity-70"
      >
        No releases found for this artist
      </div>
    </div>
  </layout>
</template>

<script>
import Layout from '@/layouts/main.vue';
import ArtistApi from '@/api/artist';
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
      artist: null,
      releases: [],
      loading: true,
      error: false,
    };
  },
  async mounted() {
    await this.loadArtist();
  },
  methods: {
    async loadArtist() {
      try {
        this.loading = true;
        this.error = false;
        const artistId = this.$route.params.id;
        const response = await ArtistApi.show(artistId);
        const data = response.data.data || response.data;

        this.artist = data;
        this.releases = data.releases || [];
      } catch (error) {
        this.error = true;
        this.artist = null;
        this.releases = [];
      } finally {
        this.loading = false;
      }
    },
    goToAlbum(albumId) {
      this.$router.push({ name: 'admin.release.show', params: { releaseId: albumId } });
    },
    playRelease(releaseId) {
      this.playerStore.playlistAddRelease(releaseId);
    },
  },
};
</script>
