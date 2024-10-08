<template>
  <layout>
    <div class="container mx-auto flex flex-col gap-5 px-2">
      <Server />
      <div class="flex bg-white dark:bg-opacity-5 pl-3 items-center rounded gap-3 shadow dark:shadow-none">
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
      <KeepAlive>
        <IndexRecommendations v-if="query.length === 0" />
        <QueryResults
          v-else
          :results="queryResults"
        />
      </KeepAlive>
    </div>
  </layout>
</template>
<script>

import { mapState } from 'pinia';

import IndexRecommendations from '@/components/index/recommendations';
import Layout from '@/layouts/main.vue';
import QueryResults from '@/components/index/queryResults.vue';
import Server from '@/components/server.vue';
// import ServerApi from '@/api/server';
import ServerStore from '@/stores/server';
import searchApi from '@/api/search';

const WAITING_TIME_QUERY = 100; // [ms]

export default {
  components: {
    IndexRecommendations,
    Layout,
    QueryResults,
    Server,
  },
  setup() {
    const example = ServerStore();
    return { example };
  },
  data() {
    return {
      query: this.$route.query.q ?? '',
      queryResults: [],
    };
  },
  computed: {
    ...mapState(ServerStore, ['activeServer']),
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
        history.pushState(null, null, '/');

        return;
      }
      const initialQuery = this.query;
      setTimeout(async () => {
        const actualQuery = this.query;
        if (actualQuery !== initialQuery) return;
        const results = (await searchApi.index(this.query)).data;
        const finalQuery = this.query;
        if (finalQuery !== initialQuery) return;
        history.pushState(null, null, `/?q=${this.query}`);

        const queryResults = {
          'albums': results.albums,
          'tracks': results.tracks,
        };
        this.queryResults = queryResults;
      }, WAITING_TIME_QUERY);
    },
  },
};
</script>
