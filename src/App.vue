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

export default {
  components: {
    AudioPlayer,
    UnifiedPlayer,
  },
};

</script>
