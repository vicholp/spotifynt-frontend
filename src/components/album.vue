<template>
  <div
    class="rounded h-full bg-black bg-opacity-90
      transition duration-300 col-span-6
      md:col-span-4 lg:col-span-3 xl:col-span-2 shadow dark:shadow-none"
    @click="addAlbum(album.id)"
  >
    <div
      :style="`background-image: url(&quot;${getArtUrl(album.art['250x250'])}&quot;);`"
      class="opacity-90 aspect-square bg-cover relative rounded hover:opacity-100 transition duration-300"
    >
      <div class="flex flex-row items-end h-full w-full text-white justify-around hover:text-opacity-90 text-opacity-0 pointer-events-none transition duration-300">
        <div class="flex flex-col w-full items-center gap-3 pointer-events-auto p-5">
          <RouterLink
            class="text-sm"
          >
            <span class="text-center font-bold">{{ album.title }}</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import PlayerStore from '../stores/player';

export default {
  props: {
    album: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const playerStore = PlayerStore();
    return { playerStore };
  },
  methods: {
    addAlbum(albumId) {
      this.playerStore.playlistAddRelease(albumId);
    },
    getArtUrl(art) {
      return `${art}`;
    },
  },
};
</script>
