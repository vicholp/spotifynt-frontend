<template>
  <layout>
    <div class="container mx-auto flex flex-col gap-5 px-2">
      <!-- Recording Header -->
      <div
        v-if="recording && !loading"
        class="bg-white dark:bg-opacity-5 rounded shadow dark:shadow-none p-6"
      >
        <div class="flex items-center gap-6">
          <div class="w-24 h-24 bg-white bg-opacity-10 rounded flex items-center justify-center">
            <span
              class="iconify text-4xl text-white text-opacity-70"
              data-icon="mdi:music-note"
            />
          </div>
          <div class="flex-1">
            <h1 class="text-3xl font-bold text-white mb-1">
              {{ recording.title }}
            </h1>
            <p
              v-if="recording.artist?.name"
              class="text-lg text-white text-opacity-80 mb-1"
            >
              {{ recording.artist.name }}
            </p>
            <div class="flex items-center gap-4 text-white text-opacity-60 text-sm">
              <span v-if="recording.duration">{{ formatDuration(recording.duration) }}</span>
              <span v-if="recording.release?.title">{{ recording.release.title }}</span>
            </div>
          </div>
          <div>
            <button
              class="px-5 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition duration-300 text-white font-medium"
              @click="playRecording"
            >
              <span
                class="iconify mr-1"
                data-icon="mdi:play"
              />
              Play
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div
        v-if="loading"
        class="bg-white dark:bg-opacity-5 rounded shadow dark:shadow-none p-8 text-center text-white text-opacity-70"
      >
        Loading recording...
      </div>

      <!-- Error State -->
      <div
        v-else-if="error"
        class="bg-white dark:bg-opacity-5 rounded shadow dark:shadow-none p-8 text-center text-white text-opacity-70"
      >
        Recording not found
      </div>

      <template v-else-if="recording">
        <!-- Add Mark -->
        <div class="bg-white dark:bg-opacity-5 rounded shadow dark:shadow-none p-6">
          <h2 class="text-lg font-semibold text-white mb-4">
            Add Mark
          </h2>
          <form
            class="flex items-end gap-4"
            @submit.prevent="storeMark"
          >
            <div class="flex flex-col gap-1 flex-1">
              <label class="text-sm text-white text-opacity-60">Comment</label>
              <input
                v-model="newMark.comment"
                type="text"
                placeholder="e.g. metadata_mismatch"
                class="px-3 py-2 rounded bg-white bg-opacity-10 text-white placeholder-white placeholder-opacity-30 border border-white border-opacity-10 focus:outline-none focus:border-opacity-30 w-full"
              >
            </div>
            <button
              type="submit"
              :disabled="savingMark"
              class="px-5 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 disabled:opacity-50 rounded-lg transition duration-300 text-white font-medium"
            >
              {{ savingMark ? 'Saving...' : 'Add' }}
            </button>
          </form>
        </div>

        <!-- Marks List -->
        <div class="bg-white dark:bg-opacity-5 rounded shadow dark:shadow-none">
          <div class="p-6 border-b border-white border-opacity-10">
            <h2 class="text-xl font-semibold text-white">
              Marks
            </h2>
          </div>

          <div
            v-if="marks.length === 0"
            class="p-8 text-center text-white text-opacity-50"
          >
            No marks yet
          </div>

          <div
            v-else
            class="divide-y divide-white divide-opacity-10"
          >
            <div
              v-for="mark in marks"
              :key="mark.id"
              class="flex items-center gap-4 p-4 hover:bg-white hover:bg-opacity-5 transition duration-300"
            >
              <div class="flex-1">
                <span class="text-white">{{ mark.comment }}</span>
              </div>
              <div class="text-sm text-white text-opacity-40">
                {{ mark.createdAt ? formatDate(mark.createdAt) : '' }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </layout>
</template>

<script>
import Layout from '@/layouts/main.vue';
import RecordingApi from '@/api/recording';
import MarkApi from '@/api/mark';
import PlayerStore from '@/stores/player';

export default {
  components: {
    Layout,
  },
  setup() {
    const playerStore = PlayerStore();
    return { playerStore };
  },
  data() {
    return {
      recording: null,
      marks: [],
      loading: true,
      error: false,
      savingMark: false,
      newMark: { comment: '' },
    };
  },
  async mounted() {
    await this.loadRecording();
  },
  methods: {
    async loadRecording() {
      try {
        this.loading = true;
        this.error = false;
        const response = await RecordingApi.show(this.$route.params.recordingId, { withMarks: true });
        const data = response.data.data || response.data;
        this.recording = data;
        this.marks = data.marks || [];
      } catch {
        this.error = true;
        this.recording = null;
      } finally {
        this.loading = false;
      }
    },
    async storeMark() {
      if (!this.newMark.comment) return;
      this.savingMark = true;
      try {
        await MarkApi.store({
          resourceType: 'recording',
          resourceId: this.$route.params.recordingId,
          comment: this.newMark.comment,
        });
        this.newMark = { comment: '' };
        await this.loadRecording();
      } finally {
        this.savingMark = false;
      }
    },
    playRecording() {
      if (this.recording) {
        this.playerStore.playlistAddTrackById(this.recording.id);
      }
    },
    formatDuration(seconds) {
      if (!seconds && seconds !== 0) return '';
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60);
      return `${m}:${s.toString().padStart(2, '0')}`;
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString();
    },
  },
};
</script>
