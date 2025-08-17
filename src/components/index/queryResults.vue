<template>
  <div
    class="col-span-12 grid grid-cols-12 gap-5"
  >
    <RouterLink
      :to="{ name: 'discover.alpha.index' }"
      class="col-span-12 bg-white bg-opacity-5 text-white text-opacity-90 rounded shadow flex flex-col p-3 h-min-[5px] cursor-pointer hover:bg-opacity-10 transition duration-200"
    >
      <div>
        Descubrir
      </div>
    </RouterLink>

    <div class="col-span-12 grid grid-cols-12 gap-3 h-min-[5px]">
      <RouterLink
        v-for="artist, index in results.artist"
        :key="artist.id"
        :to="{ name: 'artist.show', params: { id: artist.id } }"
        class="col-span-6 bg-white bg-opacity-5 rounded grid grid-cols-2 gap-10 p-5"
      >
        <img
          v-if="index < 2"
          :src="artist.art['250x250'][0]"
          alt=""
          class="col-span-1 rounded-full"
        >
        <div class="flex items-center   col-span-1">
          <div class="font-medium flex flex-col gap-1">
            {{ artist.name }}
            <div class="text-sm">
              {{ artist.releases.length }} releases
            </div>
          </div>
        </div>
      </RouterLink>
    </div>

    <div
      class="col-span-12 grid grid-cols-12 gap-3 h-min-[5px]"
    >
      <AlbumPlaceholder
        v-if="results.length == 0"
      />
      <AlbumPlaceholder
        v-if="results.length == 0"
      />
      <AlbumPlaceholder
        v-if="results.length == 0"
      />

      <Album
        v-for="album in results.albums"
        :key="album.id"
        :album="album"
      />
    </div>
    <div class="col-span-12 bg-white bg-opacity-5 text-white text-opacity-90 rounded shadow flex flex-col p-3 h-min-[5px]">
      <sp-track
        v-for="track in results.tracks"
        :key="track.id"
        :track="track"
      />
    </div>
  </div>
</template>
<script>

import Album from '../album.vue';
import SpTrack from '../track.vue';
import AlbumPlaceholder from '../albumPlaceholder.vue';

export default {
  components: {
    Album,
    SpTrack,
    AlbumPlaceholder,
  },
  props: {
    results: {
      type: Object,
      required: true,
    },
  },
};
</script>
