import { createRouter, createWebHistory } from 'vue-router';

import LoginPage from '../views/LoginPage.vue';
import DashboardPage from '../views/DashboardPage.vue';

const routes = [
  {
    path: '/', name: 'Login',
    component: LoginPage
  },
  {
    path: '/dashboard', name: 'Home',
    component: DashboardPage
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
