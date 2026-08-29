export default [
  { path: '/admin', component: () => import('@/views/admin/index.vue'), props: true },
  { path: '/admin/artists', component: () => import('@/views/admin/artists.vue'), props: true },
  { path: '/admin/artists/:id', component: () => import('@/views/admin/artist.vue'), props: true },
  { path: '/admin/releases/:releaseId', component: () => import('@/views/admin/release.vue'), props: true, name: 'admin.release.show' },
  { path: '/admin/recordings/:recordingId', component: () => import('@/views/admin/recording.vue'), props: true, name: 'admin.recording.show' },
];
