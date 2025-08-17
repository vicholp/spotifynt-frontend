import { createRouter, createWebHistory } from 'vue-router';

import Index from '@/views/index.vue';

import ServersIndex from '@/views/servers/index.vue';
import ServersCreate from '@/views/servers/create.vue';
import ServersShow from '@/views/servers/show.vue';

import Artist from '@/views/artist.vue';
import Album from '@/views/album.vue';
import Track from '@/views/track.vue';

import Playlist from '@/views/playlist.vue';
import Playlists from '@/views/playlists.vue';

import authRouter from './auth';

import discoverAlphaRoutes from './discover/alpha.js';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...authRouter,
    { path: '/', component: Index, props: true },

    { path: '/servers', component: ServersIndex, props: true },
    { path: '/servers/create', component: ServersCreate, props: true },
    { path: '/servers/:id', component: ServersShow, props: true },

    { path: '/artists/:id', component: Artist, props: true, name: 'artist.show' },
    { path: '/albums/:albumId', component: Album, props: true, name: 'album.show' },
    { path: '/tracks/:id', component: Track, props: true },

    { path: '/playlist/:id', component: Playlist, props: true },
    { path: '/playlists', component: Playlists, props: true },

    { path: '/upload', component: () => import('@/views/upload.vue'), props: true },

    { path: '/admin/artists', component: () => import('@/views/admin/artists.vue'), props: true },
    { path: '/admin/artists/:id', component: () => import('@/views/admin/artist.vue'), props: true },
    { path: '/admin/releases/:releaseId', component: () => import('@/views/admin/release.vue'), props: true, name: 'admin.release.show' },
    ...discoverAlphaRoutes,
  ],
});

export default router;
