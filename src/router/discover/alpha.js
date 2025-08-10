

export default [
  {
    path: '/discover/alpha/artist/:id',
    name: 'discover.alpha.artist',
    component: () => import('@/views/discover/alpha/artist.vue'),
  },
  {
    path: '/discover/alpha/album/:id',
    name: 'discover.alpha.album',
    component: () => import('@/views/discover/alpha/album.vue'),
  },
  {
    path: '/discover/alpha',
    component: () => import('@/views/discover/alpha/index.vue'),
    props: true,
    name: 'discover.alpha.index',
  },
];
