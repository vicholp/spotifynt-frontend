<template>
  <div
    class="col-span-12 grid grid-cols-12 gap-5"
  >
    <RouterLink
      :to="{ name: 'discover.alpha.index', query: { initialQuery: query } }"
      class="col-span-12 bg-white bg-opacity-5 text-white text-opacity-90 rounded shadow flex flex-col p-3 h-min-[5px] cursor-pointer hover:bg-opacity-10 transition duration-200"
    >
      <div class="flex items-center gap-1">
        <span
          class="iconify bg-neutral-300 rounded-full text-black text-sm"
          data-icon="mdi:alpha"
        />
        discover
      </div>
    </RouterLink>

    <div class="col-span-12 grid grid-cols-12 gap-3 h-min-[5px]">
      <RouterLink
        v-for="artist in results.artist"
        :key="artist.id"
        :to="{ name: 'artist.show', params: { id: artist.id } }"
        class="col-span-12 md:col-span-6 lg:col-span-4 bg-white bg-opacity-5 rounded gap-10 p-5"
      >
        <div class="flex gap-5 items-center">
          <img
            :src="artist.art['250x250'][0]"
            alt=""
            class="rounded-full h-16"
          >
          <div class="flex items-center">
            <div class="font-medium flex flex-col gap-1">
              <div class="flex items-center gap-1">
                <span
                  v-if="artist?.source === 'alpha'"
                  class="iconify bg-neutral-300 rounded-full text-black text-sm"
                  data-icon="mdi:alpha"
                />
                {{ artist.name }}
              </div>
              <div class="text-sm">
                {{ artist.releases.length }} releases
              </div>
            </div>
          </div>
        </div>
      </RouterLink>
    </div>

    <div
      class="col-span-12 grid grid-cols-12 gap-3 h-min-[5px]"
    >
      <Album
        v-for="album in results.albums"
        :key="album.id"
        :album="album"
        :source="AddedToQueueSource.enum.search"
      />
    </div>
    <div class="col-span-12 bg-white bg-opacity-5 text-white text-opacity-90 rounded shadow flex flex-col p-3 h-min-[5px]">
      <sp-track
        v-for="track in results.tracks"
        :key="track.id"
        :track="track"
        :source="AddedToQueueSource.enum.search"
      />
    </div>
  </div>
</template>
<script>

import Album from '../album.vue';
import SpTrack from '../track.vue';

import { AddedToQueueSource } from '@/schemas/events';


export default {
  components: {
    Album,
    SpTrack,
  },
  props: {
    results: {
      type: Object,
      required: true,
    },
    query: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      AddedToQueueSource,
    };
  },
};
</script>
