import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../views/LoginPage.vue';
import DashboardPage from '../views/DashboardPage.vue';
import ItineraryPage from '../views/ItineraryPage.vue';
import ItinerarySettingsPage from '../views/ItinerarySettingsPage.vue';

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
  {
    path: '/itinerary/:id/settings',
    name: 'ItinerarySettings',
    component: ItinerarySettingsPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
