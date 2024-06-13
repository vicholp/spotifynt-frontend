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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/login', name: 'login', component: () => import('@/views/auth/Login.vue') },
    { path: '/', component: Index, props: true },

    { path: '/servers', component: ServersIndex, props: true },
    { path: '/servers/create', component: ServersCreate, props: true },
    { path: '/servers/:id', component: ServersShow, props: true },

    { path: '/artist/:id', component: Artist, props: true },
    { path: '/album/:id', component: Album, props: true },
    { path: '/track/:id', component: Track, props: true },

    { path: '/playlist/:id', component: Playlist, props: true },
    { path: '/playlists', component: Playlists, props: true },
  ],
});

export default router;
