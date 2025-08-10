<template>
  <layout>
    <div class="container mx-auto flex flex-col gap-5 px-2">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-white">
          Library
        </h1>
        <div class="text-sm text-white text-opacity-70">
          {{ artists.length }} artists
        </div>
      </div>

      <div class="bg-white dark:bg-opacity-5 rounded shadow dark:shadow-none">
        <div
          v-if="loading"
          class="p-8 text-center text-white text-opacity-70"
        >
          Loading artists...
        </div>

        <div
          v-else-if="artists.length === 0"
          class="p-8 text-center text-white text-opacity-70"
        >
          No artists found in your library
        </div>

        <div
          v-else
          class="divide-y divide-white divide-opacity-10"
        >
          <div
            v-for="artist in artists"
            :key="artist.id"
            class="flex items-center justify-between p-4 hover:bg-white hover:bg-opacity-5 transition duration-300 cursor-pointer"
            @click="goToArtist(artist.id)"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
                <span
                  class="iconify text-xl text-white text-opacity-70"
                  data-icon="mdi:account-music"
                />
              </div>
              <div>
                <h3 class="text-white font-medium">
                  {{ artist.name }}
                </h3>
                <p class="text-sm text-white text-opacity-70">
                  {{ artist.releaseCount || 0 }} release{{ (artist.releaseCount || 0) !== 1 ? 's' : '' }}
                </p>
              </div>
            </div>
            <span
              class="iconify text-white text-opacity-40"
              data-icon="mdi:chevron-right"
            />
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
      artists: [],
      loading: true,
    };
  },
  async mounted() {
    await this.loadArtists();
  },
  methods: {
    async loadArtists() {
      try {
        this.loading = true;
        const response = await ArtistApi.index();
        this.artists = response.data.data || response.data;
      } catch (error) {
        // Handle error silently for now
        this.artists = [];
      } finally {
        this.loading = false;
      }
    },
    goToArtist(artistId) {
      this.$router.push(`/admin/artists/${artistId}`);
    },
  },
};
</script>
