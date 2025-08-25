<template>
  <div
    :class="[
      'fixed left-0 w-full top-0 h-full bg-[#EFEFEF]  transition-all duration-300 ease-in-out overflow-auto',
      mode == 'high' ? 'translate-y-0  dark:bg-[#101010] ' : 'translate-y-[calc(100dvh-5rem)] dark:bg-[#1C1C1C]'
    ]"
  >
    <nav
      :class="`items-center justify-center px-3 container flex mx-auto dark:bg-[#101010] ${mode == 'high' ? 'opacity-100 h-20 xl:sticky xl:top-0' : 'h-0 opacity-0'} transition-all duration-300 easy-in`"
      @transitionstart="handleTransitionStart"
    >
      <div
        v-if="highShow"
        to="/"
        class="text-opacity-90 text-3xl font-[Allura]"
        @click="togglePlayer"
      >
        spotifynt
      </div>
    </nav>
    <div :class="`flex flex-col xl:flex-row transition-all duration-300 ease-in-out sm:px-5 ${highShow ? 'container mx-auto gap-5 ': ''}`">
      <div :class="`container mx-auto flex py-3 px-2  sm:rounded gap-0 justify-between w-full h-fit  ${highShow ? 'xl:w-1/2 xl:mx-0 sticky top-0 xl:top-20': ''} ${mode=='high' ? 'dark:bg-[#1C1C1C]' : 'dark:bg-transparent'} transition-colors duration-300 ease-in-out`">
        <div
          :class="`flex gap-2 mr-4`"
          @click="togglePlayer"
        >
          <div
            v-if="playerStore.currentTrack.title != null"
            :style="`background-image: url(&quot;${getArtUrl(playerStore.currentTrack.release.art['500x500'])}&quot;);`"
            :class="`bg-cover rounded dark:opacity-90 ${lowStart ? 'h-14 w-14' : 'md:h-60 md:w-60 h-32 w-32'} transition-all duration-300 easy-in`"
          />
          <div
            v-else
            class="bg-cover rounded shadow aspect-1 bg-gray-300 h-14 w-14"
          />
        </div>
        <div
          :class="`flex flex-row transition-all duration-300 easy-in ${lowStart ? 'w-full opacity-100' : 'opacity-0 w-0 '}`"
        >
          <div
            v-if="lowShow"
            class="flex items-center flex-row w-full "
          >
            <div :class="`items-center flex mr-auto`">
              <div
                v-if="loaded"
                class="font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-40 sm:max-w-[45rem] w-full"
              >
                {{ playerStore?.currentTrack?.title }} - {{ playerStore?.currentTrack?.release?.title }}
              </div>
              <div
                v-else
                class="dark:text-white dark:text-opacity-30 font-bold"
              >
                The playlist is empty
              </div>
            </div>
            <div class="sm:flex items-center hidden mr-4">
              <div v-if="currentTrackFirstFile?.extension == '.flac'">
                <span
                  class=" bg-white text-xs font-bold px-2 py-0.5 text-black rounded"
                >FLAC</span>
              </div>
            </div>
            <div :class="`flex items-center ${playlistLoaded ? 'text-white text-opacity-100' : 'text-white text-opacity-30'}`">
              <button
                class="text-4xl"
                @click="playerPrevious"
              >
                <span
                  class="iconify"
                  data-icon="ic:round-navigate-before"
                />
              </button>
              <button
                class="text-4xl"
                @click="playerPlayPause"
              >
                <div v-if="playerStore.status.playing">
                  <span
                    class="iconify"
                    data-icon="ic:round-pause"
                  />
                </div>
                <div v-else>
                  <span
                    class="iconify"
                    data-icon="ic:round-play-arrow"
                  />
                </div>
              </button>
              <button
                class="text-4xl"
                @click="playerNext"
              >
                <span
                  class="iconify"
                  data-icon="ic:round-navigate-next"
                />
              </button>
            </div>
          </div>
        </div>
        <div
          :class="`flex items-center flex-col justify-center transition-all duration-300 easy-in ${highStart ? 'opacity-100 w-full' : 'opacity-0 w-0'}`"
        >
          <div
            v-if="highShow"
            class="flex items-center flex-col justify-center w-full gap-2 h-full py-0 sm:py-10"
          >
            <div
              :class="`items-center flex transition-all duration-300 duration easy-in `"
            >
              <div
                v-if="loaded"
                class="flex items-center flex-col gap-1"
              >
                <div class="text-center">
                  {{ playerStore?.currentTrack?.title }}
                </div>
                <div class="text-center font-medium hidden sm:flex ">
                  {{ playerStore?.currentTrack?.release?.title }}
                </div>
              </div>
              <div
                v-else
                class="dark:text-white dark:text-opacity-30"
              >
                The playlist is empty
              </div>
            </div>
            <div class="flex items-center mt-auto">
              <div v-if="currentTrackFirstFile?.extension == '.flac'">
                <span
                  class=" bg-white text-xs font-bold px-2 py-0.5 text-black rounded"
                >FLAC {{ Math.round(currentTrackFirstFile?.bitrateBps / 1000) }} kbps</span>
              </div>
              <div v-if="currentTrackFirstFile?.extension == '.mp3'">
                <span
                  class=" bg-black border-2 border-white text-xs font-bold px-2 py-0.5 text-white rounded"
                >MP3 {{ Math.round(currentTrackFirstFile?.bitrateBps / 1000) }} kbps</span>
              </div>
            </div>
            <div class="flex items-center">
              <button
                class="text-4xl"
                @click="playerPrevious"
              >
                <span
                  class="iconify"
                  data-icon="ic:round-navigate-before"
                />
              </button>
              <button
                class="text-4xl"
                @click="playerPlayPause"
              >
                <div v-if="playerStore.status.playing">
                  <span
                    class="iconify"
                    data-icon="ic:round-pause"
                  />
                </div>
                <div v-else>
                  <span
                    class="iconify"
                    data-icon="ic:round-play-arrow"
                  />
                </div>
              </button>
              <button
                class="text-4xl"
                @click="playerNext"
              >
                <span
                  class="iconify"
                  data-icon="ic:round-navigate-next"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div :class="`${highShow ? 'xl:w-1/2 xl:mx-0' : 'hidden'}`">
        <div
          v-if="highShow"
          class="container mx-auto flex flex-col bg-white dark:bg-[#1C1C1C] sm:rounded"
        >
          <div class="flex justify-center divide-white divide-opacity-20 py-5 gap-10">
            <button
              type="button"
              class="flex items-center gap-1 text-sm font-bold"
              @click="clearPlaylist()"
            >
              <span
                class="iconify"
                data-icon="mdi:close"
              />
              clear
            </button>
            <button
              type="button"
              class="flex items-center gap-1 text-sm font-bold"
              @click="shufflePlaylist()"
            >
              <span
                class="iconify"
                data-icon="ic:round-shuffle"
              />
              shuffle
            </button>
          </div>
          <div class="flex flex-col divide-white divide-opacity-30">
            <div
              v-for="(item, i) in playerStore.playlist.tracks"
              :key="i"
              :class="`flex items-center bg-black transition duration-300 gap-5 px-2 sm:px-5
                      ${playerStore.playlist.index === i ? 'bg-opacity-20' : 'bg-opacity-0'}`"
            >
              <button
                type="button"
                class="grow text-left bg-opacity-0 bg-black hover:bg-opacity-5 transition duration-300 py-3"
                @click="setPlaylistIndex(i)"
              >
                {{ item.title }}
              </button>
              <div
                class="flex"
                @click="removeFromPlaylist(i)"
              >
                <span
                  class="iconify"
                  data-icon="mdi:close"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import playerStore from '@/stores/player';
import PlayerBus from '@/bus/player';
import { transformVNodeArgs } from 'vue';


export default {
  setup(){
    return {
      playerStore: playerStore(),
    };
  },
  data() {
    return {
      modeEnd: 'low',
      modeStart: 'low',
      mode: 'low',
      transitionEndTimeout: null,
      transitionMedTimeout: null,
    };
  },
  computed: {
    color() {
      return '';
    },
    loaded() {
      return this.playerStore.playlist.tracks.length > 0;
    },
    highEnd() {
      return this.modeEnd === 'high';
    },
    lowEnd() {
      return this.modeEnd === 'low';
    },
    highStart() {
      return this.modeStart === 'high';
    },
    lowStart() {
      return this.modeStart === 'low';
    },

    highShow() {
      return this.highStart || (this.lowStart && this.highEnd);
    },
    lowShow() {
      return this.lowStart || (this.highStart && this.lowEnd);
    },

    currentTrackFirstFile() {
      if (this.playerStore?.currentTrack?.files && this.playerStore.currentTrack.files.length > 0) {
        return this.playerStore.currentTrack.files[0];
      }
      return null;
    },

    playlistLoaded() {
      return this.playerStore.playlist.tracks.length > 0;
    },
  },
  methods: {
    handleTransitionStart(event) {
      if (event.propertyName != 'opacity') {
        return;
      }

      clearTimeout(this.transitionEndTimeout);

      if (this.modeStart === 'low') {
        document.body.classList.add('lock-scroll'); // open

        this.modeStart = 'high';
        this.transitionEndTimeout = setTimeout(() => {
          this.modeEnd = 'high';
        }, 150);
      } else if (this.modeStart === 'high') {
        document.body.classList.remove('lock-scroll'); // close
        this.modeStart = 'low';
        this.transitionEndTimeout = setTimeout(() => {
          this.modeEnd = 'low';
        }, 150);
      }
    },
    shufflePlaylist() {
      this.playerStore.playlistShuffle();
    },
    clearPlaylist() {
      this.playerStore.playlistClear();
      this.mode = 'low';
    },
    playerPlayPause() {
      PlayerBus.emit("playpause");
    },
    playerNext() {
      PlayerBus.emit("next");
    },
    playerPrevious() {
      PlayerBus.emit("previous");
    },
    setPlaylistIndex(index) {
      this.playerStore.playlistSetIndex(index, false);
    },
    getArtUrl(art) {
      return `${art}`;
    },
    removeFromPlaylist(index) {
      this.playerStore.playlistRemoveIndex(index);

      if (this.playerStore.playlist.count === 0){
        this.mode = 'low';
      }
    },
    togglePlayer() {
      if (this.playerStore.playlist.tracks.length === 0) {
        return;
      }

      if (this.mode === 'low') {
        this.mode = 'high';
      } else {
        this.mode = 'low';
      }
    },
  },
};
</script>


<style>


.lock-scroll {
  overflow: hidden;
}

</style>
