import './assets/main.css';

import { createApp } from 'vue';

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
    Sentry.browserTracingIntegration({router}),
  ],

  sampleRate: import.meta.env.VITE_SENTRY_SAMPLE_RATE || false,
  tracesSampleRate: import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE || false,
});

app.use(i18n);
app.use(pinia);
app.use(router);

app.config.globalProperties.$dayjs = dayjs;

app.mount('#app');
