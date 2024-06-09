<template>
  <layout>
    <div class="container mx-auto flex flex-col gap-3  px-2">
      <div class="bg-white hidden dark:bg-opacity-5 p-3 rounded flex flex-col gap-3">
        <div class="p-1">
          <h2>Add server</h2>
        </div>
        <div class="flex gap-2">
          <input
            v-model="serverName"
            type="text"
            class="focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-opacity-5 flex-1 block w-full rounded border-none"
          >
          <button
            class="bg-white dark:bg-opacity-10 rounded p-2 px-4"
            @click="addServer"
          >
            Add
          </button>
        </div>
      </div>
      <div class="bg-white hidden dark:bg-opacity-5 p-3 rounded flex flex-col gap-3">
        <div class="flex w-full">
          <router-link
            :to="`servers/create`"
            class="bg-white w-full dark:bg-opacity-10 rounded p-2 px-4"
          >
            Create new server
          </router-link>
        </div>
      </div>
      <div class="bg-white dark:bg-opacity-5 p-3 rounded">
        <div class="flex justify-between items-center p-1">
          <h2>Servers</h2>
        </div>
        <div class="flex flex-col pt-3">
          <div
            v-for="server in servers"
            :key="server.id"
            class="p-2 items-center flex gap-3"
          >
            <span
              :class="`animate-pulse h-1 w-1 inline-flex rounded-full   mx-2 opacity-75
                ${ serverAvailable == 1 ? 'bg-green-400': 'bg-red-400' }`"
            />
            <div class="">
              {{ server.name }}
            </div>
            <div
              v-if="server.id == serverStore.activeServer.id"
              class="bg-gray-200 rounded px-2 text-black text-opacity-70 text-sm font-semibold py-1"
            >
              active
            </div>
            <div class="ml-auto flex gap-3 justify-end">
              <button
                v-if="server.id != serverStore.activeServer.id"
                type="button"
                class="p-2 rounded bg-white dark:bg-opacity-10"
                @click="setActiveServer(server)"
              >
                enable
              </button>

              <router-link
                class="p-2 rounded bg-white dark:bg-opacity-10"
                :to="`servers/${server.id}`"
              >
                details
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </layout>
</template>
<script>

import Layout from '../../layouts/main.vue';
import UserServerApi from '../../api/userServer';
import ServerStore from '../../stores/server';
import useUserStore from '../../stores/user';
import { mapWritableState } from 'pinia';
import { mapStores } from 'pinia'


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
      servers: [],
      serverName: "",
    };
  },
  computed: {
    ...mapWritableState(ServerStore, ['activeServer']),
    ...mapStores(useUserStore)
  },
  async mounted() {
    this.getServers();
  },
  methods: {
    async getServers() {
      this.servers = (await UserServerApi.index(this.userStore.user.id)).data.data;
    },
    addServer() {
      UserServerApi.store(this.serverName, this.userStore.user.id);
      this.serverName = "";
      this.getServers();
    },
    setActiveServer(server) {
      this.activeServer = server;
    },
  },
};
</script>
