<template>
  <div class="flex flex-col gap-14 p-3">
    <img
      :src="article.image"
      alt=""
      class="container mx-auto"
    >
    <h1 class="prose prose-2xl font-bold mx-auto dark:prose-invert text-justify">
      {{ article.title }}
    </h1>
    <div
      id="content"
      class="prose md:prose-2xl prose-xl mx-auto dark:prose-invert text-justify"
    />
    <a
      class="mx-auto rounded-lg border py-6 px-10 dark:text-white"
      :href="article.url"
    >
      fuente: {{ article?.site?.name }}
    </a>
    <RouterLink
      class="mx-auto text-center container w-full font-bold rounded-lg border py-6 px-10 dark:text-white"
      to="/"
    >
      volver
    </RouterLink>
  </div>
</template>

<script>
import articlesApi from '@/api/articles';
import { marked } from 'marked';
import { RouterLink } from 'vue-router';


export default {
  components: {
    RouterLink,
  },
  data() {
    return {
      article: {},
    };
  },
  async mounted() {
    this.article = (await articlesApi.getArticle(this.$route.params.id)).data.data;
    document.getElementById('content').innerHTML =
      marked.parse(this.article.markdown);
  },
};
</script>


