import './assets/main.css';

import { createApp } from 'vue';
import { configureEcho } from "@laravel/echo-vue";

// eslint-disable-next-line no-unused-vars
import Iconify from '@iconify/iconify';

import router from './router';

import i18n from './locales';
import pinia from './stores';
import dayjs from './helpers/dayjs';
import * as Sentry from '@sentry/vue';
import App from './App.vue';

const app = createApp(App);

Sentry.init({
  app,
  dsn: import.meta.env.VITE_SENTRY_DSN || null,
  environment: import.meta.env.VITE_SENTRY_ENVIRONMENT,
  integrations: [
    Sentry.browserTracingIntegration({ router }),
  ],

  sampleRate: import.meta.env.VITE_SENTRY_SAMPLE_RATE || false,
  tracesSampleRate: import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE || false,
});


configureEcho({
  broadcaster: "reverb",
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST,
  wsPort: import.meta.env.VITE_REVERB_PORT,
  wssPort: import.meta.env.VITE_REVERB_PORT,
  forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
  enabledTransports: ['ws', 'wss'],

  authEndpoint: `${import.meta.env.VITE_BACKEND_URL}/broadcasting/auth`,
  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  },

  // key: import.meta.env.VITE_REVERB_APP_KEY ?? 'xxx',
  // wsHost: import.meta.env.VITE_REVERB_HOST,
  // wsPort: import.meta.env.VITE_REVERB_PORT,
  // wssPort: import.meta.env.VITE_REVERB_PORT,
  // forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
  // enabledTransports: ['ws', 'wss'],
});

app.use(i18n);
app.use(pinia);
app.use(router);

app.config.globalProperties.$dayjs = dayjs;

app.mount('#app');
