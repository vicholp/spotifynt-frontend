<script setup>
import { RouterView } from 'vue-router';
</script>

<template>
  <RouterView />
  <audio-player />
</template>
<script>

import AudioPlayer from '@/components/player.vue';

export default {
  components: {
    AudioPlayer,
  },
};

</script>
