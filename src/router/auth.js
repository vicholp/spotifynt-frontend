export default [
  {
    path: '/login',
    name: 'auth.login',
    component: () => import('@/views/auth/Login.vue'),
  },
  {
    path: '/register',
    name: 'auth.register',
    component: () => import('@/views/auth/Register.vue'),
  },
];
