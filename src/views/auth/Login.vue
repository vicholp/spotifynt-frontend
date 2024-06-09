<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <input
        v-model="email"
        type="email"
        placeholder="Email"
      >
      <input
        v-model="password"
        type="password"
        placeholder="Password"
      >
      <button type="submit">
        Login
      </button>
    </form>
  </div>
</template>

<script>

import { mapStores } from 'pinia'

import authApi from '@/api/auth';
import useUserStore from '@/stores/user';
import auth from '@/api/auth';

export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  computed: {
    ...mapStores(useUserStore)
  },
  methods: {
    async login() {
      const response = await authApi.login({
        'email': this.email,
        'password': this.password,
      });

      if (response.status === 200) {
        const me = (await authApi.me()).data;

        this.userStore.setUser(me);
        this.$router.push('/');
      }
    },
  },
  mounted() {
    authApi.csrfCookie();
  },
};

</script>
