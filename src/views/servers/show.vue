<template>
  <layout>
    <div class="container mx-auto flex flex-col gap-3 px-2">
      <div class="bg-white dark:bg-opacity-5 p-2 rounded ">
        <h2>
          {{ server.name }}
        </h2>
      </div>
    </div>
  </layout>
</template>
<script>

import Layout from '../../layouts/main.vue';
import ServerApi from '../../api/server';
import ServerStore from '../../stores/server';
import useUserStore from '../../stores/user';
import { mapWritableState } from 'pinia';
import { mapStores } from 'pinia';

export default {
  components: {
    Layout,
  },
  props: {
    authUser: {
      default: () => {},
      type: Object,
    },
  },
  setup() {
    const serverStore = ServerStore();
    return { serverStore };
  },
  data() {
    return {
      server: [],
    };
  },
  computed: {
    ...mapWritableState(ServerStore, ['activeServer']),
    ...mapStores(useUserStore),
  },
  async mounted() {
    this.getServer();
  },
  methods: {
    async getServer() {
      this.server = (await ServerApi.show(this.$route.params.id)).data.data;

      ServerApi.tracks.index(this.server.id);
      ServerApi.artists.index(this.server.id);
      ServerApi.releases.index(this.server.id);
      ServerApi.releaseGroups.index(this.server.id);
    },
    setActiveServer(server) {
      this.activeServer = server;
    },
  },
};
</script>
