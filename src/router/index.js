import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../views/LoginPage.vue';
import DashboardPage from '../views/DashboardPage.vue';
import ItineraryPage from '../views/ItineraryPage.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardPage,
  },
  {
    path: '/itinerary/:id',
    name: 'ItineraryPage',
    component: ItineraryPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
