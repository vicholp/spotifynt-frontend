<template>
  <layout>
    <div class="container mx-auto flex flex-col gap-5 px-2">
      <div class="flex items-center sm:gap-10 gap-5 flex-col sm:flex-row">
        <div class="flex bg-white  dark:bg-opacity-5 pl-3 items-center rounded gap-3 shadow dark:shadow-none w-full">
          <span
            class="iconify text-lg"
            data-icon="mdi:magnify"
          />
          <input
            ref="search"
            v-model="query"
            type="text"
            class="bg-white bg-opacity-0 w-full border-0 h-12 p-0 px-3 dark:focus:bg-opacity-10 dark:focus:ring-0 rounded-r"
            placeholder="search"
            @input="sendQuery"
            @keyup.enter.prevent="$refs.search.blur()"
          >
        </div>
        <div class="justify-end flex gap-8 items-center h-4">
          <div class="font-bold text-sm whitespace-nowrap dark:text-opacity-70 dark:text-white">
            {{ playerStore?.playlist?.count > 0 ? playerStore?.playlist?.count + ' tracks' : 'playlist empty' }}
          </div>
          <div
            v-if="playerStore?.playlist?.count > 0"
            class="flex gap-2"
          >
            <div
              class="font-bold text-sm rounded dark:text-opacity-80 dark:text-white dark:bg-white dark:bg-opacity-5 px-2 py-1"
              @click="shufflePlaylist"
            >
              shuffle
            </div>
            <div
              class="font-bold text-sm rounded dark:text-opacity-80 dark:text-white dark:bg-white dark:bg-opacity-5 px-2 py-1"
              @click="clearPlaylist"
            >
              clear
            </div>
          </div>
        </div>
      </div>
      <KeepAlive>
        <IndexRecommendations v-if="query.length === 0" />
        <QueryResults
          v-else
          :results="queryResults"
          :query="query"
        />
      </KeepAlive>
    </div>
  </layout>
</template>
<script>

import IndexRecommendations from '@/components/index/recommendations';
import Layout from '@/layouts/main.vue';
import QueryResults from '@/components/index/queryResults.vue';
import searchApi from '@/api/search';

import PlayerStore from '@/stores/player';

const WAITING_TIME_QUERY = 100; // [ms]

export default {
  components: {
    IndexRecommendations,
    Layout,
    QueryResults,
  },
  setup() {
    return { playerStore: PlayerStore(),
    };
  },
  data() {
    return {
      query: this.$route.query.q ?? '',
      queryResults: [],
    };
  },
  async mounted() {
    if (import.meta.env.APP_ENV === 'production') {
      window.addEventListener('beforeunload', e => {
        e.preventDefault();
        e.returnValue = '';
      });
    }

    if (this.query.length > 0) {
      this.sendQuery();
    }
  },
  created() {
    window.addEventListener('keydown', this.keyDownHandler);
  },
  unmounted() {
    window.removeEventListener('keydown', this.keyDownHandler);
  },
  methods: {
    shufflePlaylist() {
      this.playerStore.playlistShuffle();
    },
    clearPlaylist() {
      this.playerStore.playlistClear();
    },
    keyDownHandler(e) {
      if (e.key == '/') {
        e.preventDefault();

        this.$refs.search.focus();
      }

      if (e.key == 'Escape') {
        this.query = '';
        this.queryResults = [];
      }
    },
    // Espera WAITING_TIME_QUERY para hacer la query, y comprueba que la query no ha cambiado para hacerla.
    async sendQuery() {
      if (this.query.length === 0) {
        this.queryResults = [];

        this.$router.push({ query: { } });
        return;
      }
      const initialQuery = this.query;
      setTimeout(async () => {
        const actualQuery = this.query;
        if (actualQuery !== initialQuery) return;
        const results = (await searchApi.index(this.query)).data;
        const finalQuery = this.query;
        if (finalQuery !== initialQuery) return;

        this.$router.push({ query: { q: this.query } });

        const queryResults = {
          'albums': results?.albums,
          'tracks': results?.tracks,
          'artist': results?.artists,
        };
        this.queryResults = queryResults;
      }, WAITING_TIME_QUERY);
    },
  },
};
</script>
