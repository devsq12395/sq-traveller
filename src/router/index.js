import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../views/LoginPage.vue';
import DashboardPage from '../views/DashboardPage.vue';
import ItineraryPage from '../views/ItineraryPage.vue';
import UserSettingsPage from '../views/UserSettingsPage.vue';
import HomePage from '../views/HomePage.vue';
import SetUsernamePage from '../views/SetUsernamePage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/login',
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
    path: '/settings',
    name: 'UserSettings',
    component: UserSettingsPage,
  },
  {
    path: '/set-username',
    name: 'SetUsernamePage',
    component: SetUsernamePage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
