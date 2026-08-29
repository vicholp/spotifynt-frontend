<template>
  <Transition mode="out-in">
    <div
      v-if="!added"
      class="rounded h-full bg-black bg-opacity-90
      transition duration-300 col-span-6
      md:col-span-4 lg:col-span-3 xl:col-span-2 shadow dark:shadow-none"
      @click="addAlbum(album.id)"
    >
      <div
        :style="`background-image: url(&quot;${getArtUrl(album.art['250x250'])}&quot;);`"
        class="opacity-90 aspect-square bg-cover relative rounded hover:opacity-100 transition duration-300"
      >
        <div class="flex flex-row items-end h-full w-full text-white justify-around text-opacity-90  pointer-events-none transition duration-300">
          <RouterLink
            class="text-sm flex flex-col w-full items-center gap-3 pointer-events-auto py-2 px-3 bg-black bg-opacity-60 rounded-b"
            :to="{ name: 'album.show', params: { albumId: album.id } }"
            @click.stop
          >
            <span class="justify-center items-center gap-1 font-bold whitespace-nowrap overflow-hidden overflow-ellipsis flex">
              <span
                v-if="album?.extensions?.includes('.flac')"
                class="iconify"
                data-icon="mdi:high-definition-box"
              />
              <span
                v-else-if="album.source === 'alpha'"
                class="iconify bg-neutral-300 rounded-full text-black text-sm"
                data-icon="mdi:alpha"
              />
              {{ trimmedTitle(album.title) }}
            </span>
          </RouterLink>
        </div>
      </div>
    </div>
    <div
      v-else
      class="rounded h-full bg-black bg-opacity-60
      transition duration-300 col-span-6
      md:col-span-4 lg:col-span-3 xl:col-span-2 shadow dark:shadow-none"
      @click="addAlbum(album.id)"
    >
      <div
        class="opacity-90 aspect-square bg-cover relative rounded hover:opacity-100 transition duration-300
      flex flex-col justify-between p-5 text-white text-opacity-80"
      >
        <span class=" text-sm text-center font-bold">added</span>
        <span class=" text-sm text-center font-bold">{{ album.title }}</span>
      </div>
    </div>
  </Transition>
</template>
<script>

import PlayerStore from '../stores/player';

import { RecordingAddedToQueueGroup } from '@/schemas/events';
import { useEvents } from '@/composables/events';
import { ReleaseShowedEvent } from '@/schemas/events';

export default {
  props: {
    album: {
      type: Object,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
  },
  setup() {
    const playerStore = PlayerStore();
    const { storeEvent } = useEvents();

    return { playerStore, storeEvent };
  },
  data() {
    return {
      added: false,
    };
  },
  mounted() {
    this.storeEvent(ReleaseShowedEvent.parse({
      payload: {
        releaseId: this.album.id,
        source: this.source,
      },
    }));
  },
  methods: {
    addAlbum(albumId) {
      this.added = true;

      this.playerStore.playlistAddRelease(albumId, this.source, RecordingAddedToQueueGroup.enum.by_release);

      setTimeout(() => {
        this.added = false;
      }, 1000);
    },
    getArtUrl(art) {
      return `${art}`;
    },
    trimmedTitle(title) {
      if (title.length > 25) {
        return `${title.substring(0, 20)}...`;
      }
      return title;
    },
  },
};
</script>

<style>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.20s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
