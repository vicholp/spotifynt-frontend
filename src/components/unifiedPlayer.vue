<template>
  <div
    :class="[
      'fixed left-0 w-full top-0 h-full bg-[#EFEFEF]  transition-all duration-300 ease-in-out overflow-auto',
      mode == 'high' ? 'translate-y-0  dark:bg-[#101010] ' : 'translate-y-[calc(100dvh-5rem)] dark:bg-[#1C1C1C]'
    ]"
  >
    <div class="h-0.5 w-1/2 bg-white/50">

    </div>
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
                class="font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-32 sm:max-w-[45rem] w-full"
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
            <div :class="`flex items-center mr-0 sm:mr-2 p-1 text-xl rounded ${playlistLoaded ? 'text-opacity-100 text-primary-500' : 'text-black text-opacity-30 dark:text-white'}`">
              <div v-if="!playerStore.playingInThisDevice">
                <span class="iconify" data-icon="mdi:wireless"></span>
              </div>
            </div>
            <div :class="`flex items-center ${playlistLoaded ? 'text-black text-opacity-100 dark:text-white' : 'text-black text-opacity-30 dark:text-white'}`">
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
            <div
              v-if="!playerStore.playingInThisDevice"
              :class="`text-white text-xs font-bold px-2 py-0.5  rounded bg-primary-500`"
            >
              <div class="flex  gap-1 items-center">
                <span
                  class="iconify text-lg"
                  data-icon="mdi:wireless"
                />
                playing in another device
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
      <div :class="`${highShow ? 'xl:w-1/2 xl:mx-0 flex flex-col gap-2' : 'hidden'}`">
        <div
          v-if="highShow"
          class="container mx-auto flex flex-col bg-white dark:bg-[#1C1C1C] sm:rounded"
        >
          <div class="flex justify-center divide-white divide-opacity-20 py-5 gap-10">
            <button
              type="button"
              class="flex items-center gap-1 text-sm font-bold"
              @click="markTrack"
            >
              <span
                class="iconify"
                data-icon="mdi:bug-outline"
              />
              report track
            </button>
          </div>
        </div>
        <div
          v-if="highShow"
          class="container mx-auto flex flex-col bg-white dark:bg-[#1C1C1C] sm:rounded"
        >
          <div class="flex justify-center divide-white divide-opacity-20 py-5 gap-10">
            <button
              type="button"
              class="flex items-center text-sm font-bold"
            >
              <div
                v-if="!playerStore.localMode"
                class="flex items-center gap-1"
                @click="localOnly()"
              >
                <span
                  class="iconify"
                  data-icon="mdi:local"
                />
                enable local only
              </div>
              <div
                v-else
                class="flex items-center gap-1"
                @click="cloudMode()"
              >
                <span
                  class="iconify"
                  data-icon="mdi:cloud"
                />
                enable cloud play
              </div>
            </button>
            <button
              v-if="!playerStore.playingInThisDevice"
              type="button"
              class="flex items-center gap-1 text-sm font-bold"
              @click="playInThisDevice()"
            >
              <span
                class="iconify"
                data-icon="mdi:speaker-play"
              />
              play here
            </button>
          </div>
          <div class="flex flex-col divide-white divide-opacity-30">
            <div
              v-for="device in devicesStore.devices"
              :key="device.uuid"
              :class="`flex items-center bg-black transition duration-300 gap-5 px-2 sm:px-5
                ${device.uuid === playerStore.playingDevice ? 'bg-opacity-20' : 'bg-opacity-0'}`"
            >
              <div class="flex items-center gap-1 py-3">
                {{ device.name }}
                <div
                  v-if="device.uuid === playerStore.playingDevice && playerStore?.status?.playing"
                >
                  <span
                    class="text-xs iconify animate-[spin_10s_linear_infinite] "
                    data-icon="streamline-ultimate:cd-playing"
                  />
                </div>
                <div
                  v-else-if="device.uuid === playerStore.playingDevice && !playerStore?.status?.playing"
                >
                  <span
                    class="text-xs iconify animate-none "
                    data-icon="streamline-ultimate:cd-playing"
                  />
                </div>
              </div>
              <div class="py-3 ml-auto flex gap-2 ">
                <div v-if="device.uuid === devicesStore.thisDeviceUuid">
                  this device
                </div>
                <div
                  v-if="device.uuid !== playerStore.playingDevice"
                  class="cursor-pointer"
                  @click="playInRemoteDevice(device.uuid)"
                >
                  play here
                </div>
              </div>
            </div>
          </div>
        </div>
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
            <button
              type="button"
              class="flex items-center gap-1 text-sm font-bold"
              @click="playlistt()"
            >
              <span
                class="iconify"
                data-icon="ic:round-shuffle"
              />
              recommendations
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
import devicesStore from '@/stores/devices';

import recommendationsApi from '@/api/recommendation';
import marksApi from '@/api/mark';


export default {
  setup(){
    return {
      playerStore: playerStore(),
      devicesStore: devicesStore(),
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
    trackPlayedLevel() {
      return this.playerStore.status.playedSeconds / this.playerStore.currentTrack.durationSeconds;
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
    playlistt() {
      recommendationsApi.playlist(this.playerStore.playlist.tracks.map(t => t.id)).then((response) => {

        console.log(response);
        response.data.recommendations.recommendations.forEach(trackId => {
          this.playerStore.playlistAddTrackById(trackId);
        })
      });
    },
    markTrack() {
      const track = this.playerStore.currentTrack;

      marksApi.store({
        resourceId: track.id,
        resourceType: 'recording',
        comment: 'metadata_mismatch',
      }).then((response) => {
        console.log(response);
      });
    },
    playInThisDevice() {
      this.playerStore.playInThisDevice();
    },
    playInRemoteDevice(uuid) {
      this.playerStore.playInRemoteDevice(uuid);
    },
    localOnly() {
      this.playerStore.localOnly();
    },
    cloudMode() {
      this.playerStore.cloudMode();
    },
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
