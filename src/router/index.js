import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../views/LoginPage.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginPage
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
