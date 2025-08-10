<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Upload Files
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          Select multiple files to upload to your library
        </p>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <!-- File Drop Zone -->
        <div
          class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center transition-colors duration-200"
          :class="{
            'border-primary-500 bg-primary-50 dark:bg-primary-900/20': isDragOver,
            'hover:border-gray-400 dark:hover:border-gray-500': !isDragOver
          }"
          @dragover.prevent="handleDragOver"
          @dragleave.prevent="handleDragLeave"
          @drop.prevent="handleDrop"
        >
          <Icon
            icon="heroicons:cloud-arrow-up"
            class="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4"
          />
          <div class="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Drop files here or click to select
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Support for multiple files (MP3, FLAC, WAV, etc.)
          </div>
          <input
            ref="fileInput"
            type="file"
            multiple
            accept="audio/*"
            class="hidden"
            @change="handleFileSelect"
          >
          <button
            type="button"
            class="px-4 py-2 bg-primary-500 text-white font-medium rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 transition-colors duration-200"
            @click="$refs.fileInput.click()"
          >
            Select Files
          </button>
        </div>

        <!-- Selected Files List -->
        <div
          v-if="selectedFiles.length > 0"
          class="mt-6"
        >
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Selected Files ({{ selectedFiles.length }})
          </h3>
          <div class="space-y-2 max-h-60 overflow-y-auto">
            <div
              v-for="(file, index) in selectedFiles"
              :key="file.name + index"
              class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
            >
              <div class="flex items-center space-x-3 flex-1">
                <Icon
                  icon="heroicons:musical-note"
                  class="w-5 h-5 text-primary-500"
                />
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {{ file.name }}
                  </p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatFileSize(file.size) }}
                  </p>
                  <!-- Individual file progress -->
                  <div
                    v-if="file.uploadStatus"
                    class="mt-1"
                  >
                    <div
                      v-if="file.uploadStatus === 'uploading'"
                      class="flex items-center text-xs text-blue-600 dark:text-blue-400"
                    >
                      <Icon
                        icon="heroicons:arrow-path"
                        class="w-3 h-3 mr-1 animate-spin"
                      />
                      Uploading...
                    </div>
                    <div
                      v-else-if="file.uploadStatus === 'success'"
                      class="flex items-center text-xs text-green-600 dark:text-green-400"
                    >
                      <Icon
                        icon="heroicons:check-circle"
                        class="w-3 h-3 mr-1"
                      />
                      Uploaded
                      <button
                        type="button"
                        class="ml-2 px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 focus:outline-none focus:ring-1 focus:ring-green-500"
                        @click="playAudio(file.url)"
                      >
                        <Icon
                          icon="heroicons:play"
                          class="w-3 h-3"
                        />
                      </button>
                    </div>
                    <div
                      v-else-if="file.uploadStatus === 'error'"
                      class="flex items-center text-xs text-red-600 dark:text-red-400"
                    >
                      <Icon
                        icon="heroicons:x-circle"
                        class="w-3 h-3 mr-1"
                      />
                      Failed
                    </div>
                  </div>
                </div>
              </div>
              <button
                type="button"
                class="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1"
                :disabled="file.uploadStatus === 'uploading'"
                @click="removeFile(index)"
              >
                <Icon
                  icon="heroicons:x-mark"
                  class="w-4 h-4"
                />
              </button>
            </div>
          </div>
        </div>

        <!-- Upload Controls -->
        <div
          v-if="selectedFiles.length > 0"
          class="mt-6 flex justify-between items-center"
        >
          <div class="flex space-x-2">
            <button
              type="button"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              @click="clearFiles"
            >
              Clear All
            </button>
            <button
              v-if="hasCompletedFiles"
              type="button"
              class="px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              @click="clearCompletedFiles"
            >
              Clear Completed
            </button>
          </div>
          <button
            type="button"
            class="px-6 py-2 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isUploading"
            @click="uploadFiles"
          >
            <span
              v-if="isUploading"
              class="flex items-center"
            >
              <Icon
                icon="heroicons:arrow-path"
                class="w-4 h-4 mr-2 animate-spin"
              />
              Uploading...
            </span>
            <span v-else>
              Upload {{ selectedFiles.length }} File{{ selectedFiles.length !== 1 ? 's' : '' }}
            </span>
          </button>
        </div>

        <!-- Upload Progress -->
        <div
          v-if="uploadProgress.show"
          class="mt-4"
        >
          <div class="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              class="bg-green-500 h-2 rounded-full transition-all duration-300"
              :style="{ width: uploadProgress.percentage + '%' }"
            />
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
            {{ uploadProgress.percentage }}% complete
          </p>
        </div>

        <!-- Upload Status Messages -->
        <div
          v-if="uploadStatus.message"
          class="mt-4"
        >
          <div
            class="p-4 rounded-md"
            :class="{
              'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400': uploadStatus.type === 'success',
              'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400': uploadStatus.type === 'error',
              'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400': uploadStatus.type === 'info'
            }"
          >
            <div class="flex">
              <Icon
                :icon="getStatusIcon()"
                class="w-5 h-5 mr-2"
              />
              <span>{{ uploadStatus.message }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Icon } from '@iconify/vue';
import uploadApi from '@/api/upload';

export default {
  name: 'Upload',
  components: {
    Icon,
  },
  data() {
    return {
      selectedFiles: [],
      isDragOver: false,
      isUploading: false,
      uploadProgress: {
        show: false,
        percentage: 0,
      },
      uploadStatus: {
        type: null,
        message: '',
      },
    };
  },
  computed: {
    hasCompletedFiles() {
      return this.selectedFiles.some(file => 
        file.uploadStatus === 'success' || file.uploadStatus === 'error',
      );
    },
  },
  methods: {
    handleDragOver() {
      this.isDragOver = true;
    },
    handleDragLeave() {
      this.isDragOver = false;
    },
    handleDrop(event) {
      this.isDragOver = false;
      const files = Array.from(event.dataTransfer.files);
      this.addFiles(files);
    },
    handleFileSelect(event) {
      const files = Array.from(event.target.files);
      this.addFiles(files);
      // Clear the input so the same file can be selected again
      event.target.value = '';
    },
    addFiles(files) {
      // Filter for audio files only
      const audioFiles = files.filter(file => file.type.startsWith('audio/'));
      
      // Add uploadStatus property to each file for reactivity
      audioFiles.forEach(file => {
        file.uploadStatus = null;
      });
      
      // Add new files to the existing selection
      this.selectedFiles.push(...audioFiles);
      
      // Show info message if some files were filtered out
      if (audioFiles.length < files.length) {
        this.showStatus('info', `${audioFiles.length} audio files selected. Non-audio files were filtered out.`);
      } else if (audioFiles.length > 0) {
        this.showStatus('success', `${audioFiles.length} file${audioFiles.length !== 1 ? 's' : ''} selected.`);
      }
    },
    removeFile(index) {
      const file = this.selectedFiles[index];
      // Don't allow removal if file is currently uploading
      if (file.uploadStatus === 'uploading') {
        return;
      }
      this.selectedFiles.splice(index, 1);
    },
    clearFiles() {
      // Only clear files that are not currently uploading
      this.selectedFiles = this.selectedFiles.filter(file => file.uploadStatus === 'uploading');
      this.uploadStatus.message = '';
    },
    clearCompletedFiles() {
      // Remove files that have completed (success or error), keep pending and uploading
      this.selectedFiles = this.selectedFiles.filter(file => 
        !file.uploadStatus || file.uploadStatus === 'uploading',
      );
    },
    async uploadFiles() {
      if (this.selectedFiles.length === 0) return;

      this.isUploading = true;
      this.uploadProgress.show = true;
      this.uploadProgress.percentage = 0;
      this.uploadStatus.message = '';

      let completedFiles = 0;
      let successfulUploads = 0;
      let failedUploads = 0;

      // Upload each file individually
      for (let i = 0; i < this.selectedFiles.length; i++) {
        const file = this.selectedFiles[i];
        try {
          // Set file status to uploading
          file.uploadStatus = 'uploading';

          // Make individual API request
          const response = await uploadApi.uploadFile(file);

          // Mark as successful and store the URL
          file.uploadStatus = 'success';
          file.url = response.data.url;
          successfulUploads++;
        } catch (error) {
          // Mark as failed
          file.uploadStatus = 'error';
          failedUploads++;
        }

        completedFiles++;
        
        // Update overall progress
        this.uploadProgress.percentage = Math.round((completedFiles / this.selectedFiles.length) * 100);
      }

      // Show final status
      setTimeout(() => {
        if (failedUploads === 0) {
          this.showStatus('success', `Successfully uploaded all ${successfulUploads} files!`);
        } else if (successfulUploads === 0) {
          this.showStatus('error', `Failed to upload all ${failedUploads} files.`);
        } else {
          this.showStatus('info', `Uploaded ${successfulUploads} files successfully, ${failedUploads} failed.`);
        }

        // Hide progress after a delay
        setTimeout(() => {
          this.uploadProgress.show = false;
          this.uploadProgress.percentage = 0;
        }, 2000);
      }, 500);

      this.isUploading = false;
    },
    showStatus(type, message) {
      this.uploadStatus.type = type;
      this.uploadStatus.message = message;
      
      // Auto-hide success messages
      if (type === 'success') {
        setTimeout(() => {
          this.uploadStatus.message = '';
        }, 5000);
      }
    },
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    getStatusIcon() {
      if (this.uploadStatus.type === 'success') {
        return 'heroicons:check-circle';
      } else if (this.uploadStatus.type === 'error') {
        return 'heroicons:x-circle';
      } else {
        return 'heroicons:information-circle';
      }
    },
    playAudio(url) {
      const audio = new Audio(url);
      audio.play();
    },
  },
};
</script>