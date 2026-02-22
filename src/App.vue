<script setup>
import { RouterView } from 'vue-router';
</script>

<template>
  <RouterView />
  <audio-player />
  <unified-player />
</template>
<script>

import AudioPlayer from '@/components/player.vue';
import UnifiedPlayer from '@/components/unifiedPlayer.vue';
import userApi from '@/api/user';
import PlayerStore from '@/stores/player';
import DevicesStore from '@/stores/devices';
import deviceApi from '@/api/device';

export default {
  components: {
    AudioPlayer,
    UnifiedPlayer,
  },

  setup() {

  },
  data() {
    return {
      debounceTimeout: null,
    };
  },
  async mounted() {
    const token = localStorage.getItem('token');
    if (token) {
      this.$router.push('/');
    } else {
      this.$router.push('/auth/login');
    }


    const playerStore = PlayerStore();
    const devicesStore = DevicesStore();


    try {
      const localMode = localStorage.getItem('local_mode');
      if (localMode === 'true') {
        playerStore.$patch({
          playerStore,
          localMode: true,
          initialized: true,
          playingInThisDevice: true,
        });

        return;
      } else {
        const playingStatusResponse = await userApi.me.getPlayingStatus();

        if (playingStatusResponse.status === 200 && playingStatusResponse?.data?.data?.playerState) {
          const playerState = playingStatusResponse.data.data.playerState;

          const playingInThisDevice = playerState.playingDevice === devicesStore.thisDeviceUuid;

          playerStore.$patch({
            ...playerState,
            localMode: false,
            initialized: true,
            playingInThisDevice,
          });
        } else {
          playerStore.$patch({
            ...playerStore,
            localMode: false,
            initialized: true,
            playingInThisDevice: true,
          });

          await userApi.me.setPlayingStatus({playerState: playerStore});
        }

        let deviceUuid = localStorage.getItem('device_uuid');

        if (!deviceUuid) {
          deviceUuid = crypto.randomUUID();
          localStorage.setItem('device_uuid', deviceUuid);
        }

        devicesStore.setThisDeviceUuid(deviceUuid);

        await deviceApi.upsert({
          uuid: deviceUuid,
          name: 'Spotifynt Web Player',
          type: 'web',
        });

        const devices = await deviceApi.index();
        devicesStore.setDevices(devices.data.data);
      }


      playerStore.$subscribe(this.updatePlayingStatus);
    } catch (error) {
      console.error('Error during app initialization:', error);
    }
  },
  methods: {
    async updatePlayingStatus(mutation, state) {
      if (mutation.type === 'patch object') {
        console.log('Player store updated, not sending playing status update to server because it was a patch object mutation');

        return;
      }

      if (state.localMode) {
        console.log('Player store updated, not sending playing status update to server because local mode is enabled');

        return;
      }

      if (this.debounceTimeout) {
        clearTimeout(this.debounceTimeout);
      }

      this.debounceTimeout = setTimeout(async () => {
        const playerStore = PlayerStore();
        const {playingInThisDevice: _, localMode: __, ...playerStoreState} = playerStore.$state;
        console.log('Updating playing status...', playerStoreState);

        await userApi.me.setPlayingStatus({playerState: playerStoreState});
      }, 10);
    },
  },
};

</script>
