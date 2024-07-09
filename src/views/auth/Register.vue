<template>
  <div class=" h-screen flex items-center justify-center">
    <div class="flex flex-col  bg-white gap-8 p-8  items-center rounded-xl shadow border ">
      <div
        class="text-opacity-90 text-3xl font-[Allura]"
      >
        spotifynt
      </div>
      <div class="flex flex-col gap-4">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="p-2 w-full max-w-xs border-2 border-gray-200 rounded-md focus:outline-none  focus:border-primary-500"
        >
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="p-2 w-full max-w-xs border-2 border-gray-200 rounded-md focus:outline-none focus:border-primary-500"
        >
      </div>
      <button
        class="px-4 py-2 w-full max-w-xs border border-primary-500 text-primary-500 font-semibold rounded-md hover:bg-primary-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        @click="login"
      >
        Register
      </button>
    </div>
  </div>
</template>
<script>
import authApi from '@/api/auth';
import userApi from '@/api/user';

import { mapStores } from 'pinia';
import useUserStore from '@/stores/user';

export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  computed: {
    ...mapStores(useUserStore),
  },
  async mounted() {
    authApi.csrfCookie();
  },
  methods: {
    async login() {
      const response = await authApi.register({
        'email': this.email,
        'password': this.password,
        'name': this.email,
        'password_confirmation': this.password,
      });

      if (response.status === 201) {
        const me = (await userApi.me()).data.data;

        this.userStore.setUser(me);
        this.$router.push('/');
      }
    },
  },
};

</script>
