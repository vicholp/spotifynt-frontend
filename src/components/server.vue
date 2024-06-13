<template>
  <router-link
    to="servers"
    class="bg-white dark:bg-opacity-5 p-3 w-full rounded flex items-center gap-2 shadow dark:shadow-none"
  >
    <span
      :class="`animate-pulse h-1 w-1 inline-flex rounded-full  mx-2 opacity-75
      ${ serverAvailable == 1 ? 'bg-green-400': 'bg-red-400' }`"
    />
    <p>
      {{ serverStore.activeServer.name }}
    </p>
    <div class="ml-auto">
      <span
        class="iconify text-lg"
        data-icon="mdi:dots-vertical"
      />
    </div>
  </router-link>
</template>
<script>

import ServerStore from '../stores/server';

export default {
  setup() {
    const serverStore = ServerStore();
    return { serverStore };
  },
  data() {
    return {
      serverAvailable: -1,
      serverRefreshTimeout: null,
    };
  },
  mounted() {
    this.refreshServer();

    this.serverRefreshTimeout = setInterval(() => {
      this.refreshServer();
    }, 10000);
  },
  methods: {
    refreshServer() {
      fetch(`${this.serverStore.getActiveServerPath()}`)
        .then(res => {
          if (res.ok) {
            this.serverAvailable = 1;
            return;
          }
          this.serverAvailable = 0;
        }).catch(() => {
          this.serverAvailable = 0;
        });
    },
  },
};
</script>
