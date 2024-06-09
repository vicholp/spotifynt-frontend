<template>
  <main>
    <div class="grid grid-cols-12 gap-6 p-6 container mx-auto">
      <div class="col-span-12">
        <input
          v-model="search"
          type="text"
          class="w-full p-2 border rounded-lg"
          placeholder="Search articles"
          @input="searchArticles(search)"
        >
      </div>
      <div class="col-span-12 flex gap-6 items-center">
        <p class="text-sm dark:text-white">
          Last updated: {{ lastArticleDate?.fromNow() }}
        </p>
        <button
          class="dark:border text-white font-bold py-2 px-4 rounded"
          @click="updateNow()"
        >
          Update now
        </button>
      </div>
      <div
        v-for="article in articles"
        :key="article.id"
        class="col-span-12 md:col-span-6 xl:col-span-4"
      >
        <router-link :to="`/articles/${article.id}`">
          <div class="bg-white dark:bg-black shadow dark:shadow-none dark:text-white rounded-lg flex flex-col h-full">
            <img
              :src="`${article.image}`"
              class="rounded-t-lg"
            >
            <div class="flex flex-col gap-3 p-6 dark:border-x grow dark:border-gray-800">
              <h2>{{ article.title }}</h2>
            </div>
            <div class="flex gap-3 px-6 py-2 text-sm justify-between font-bold dark:border rounded-b-lg dark:border-gray-800">
              <p>{{ article?.site?.name }}</p>
              <p>{{ $dayjs(article?.publishedAt)?.format('DD MMMM YYYY') }}</p>
            </div>
          </div>
        </router-link>
      </div>
      <div class="col-span-12">
        <button
          class="w-full py-2 px-4 border rounded-lg dark:border-white dark:text-white"
          @click="loadMore()"
        >
          Load more
        </button>
      </div>
    </div>
  </main>
</template>

<script>
import { RouterLink } from 'vue-router';
import articlesApi from '@/api/articles';
import sitesApi from '@/api/sites';
import statsApi from '@/api/stats';

export default {
  name: 'HomeView',
  components: {
    RouterLink,
  },
  data() {
    return {
      articles: [],
      search: null,
      searchTimeout: null,
      lastArticleDate: null,
      page: 1,
    };
  },
  async mounted() {
    this.loadArticles();
    this.lastArticleDate = this.$dayjs((await statsApi.getLastArticleDate()).data);
  },
  methods: {
    async searchArticles(search) {
      this.articles = (await articlesApi.getArticles({'search': search, 'page-limit': 250})).data.data;
    },
    async updateNow() {
      sitesApi.syncAll();
    },
    async loadArticles() {
      this.articles.push(...(await articlesApi.getArticles({'page': this.page, 'page-limit': 24})).data.data);
    },
    async loadMore() {
      this.page += 1;
      this.loadArticles();
    },
  },
};
</script>
