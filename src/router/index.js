import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../views/LoginPage.vue';
import DashboardPage from '../views/DashboardPage.vue';
import ItineraryPage from '../views/ItineraryPage.vue';
import UserSettingsPage from '../views/UserSettingsPage.vue';
import HomePage from '../views/HomePage.vue';
import SetUsernamePage from '../views/SetUsernamePage.vue';
import DataDeletionPage from '../views/DataDeletionPage.vue';
import AboutUsPage from '../views/AboutUsPage.vue';
import ProfilePage from '@/components/user/ProfilePage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { title: 'GoAgenda' },
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { title: 'GoAgenda' },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardPage,
    meta: { title: 'GoAgenda' },
  },
  {
    path: '/itinerary/:id',
    name: 'ItineraryPage',
    component: ItineraryPage,
    meta: { title: 'GoAgenda' },
  },
  {
    path: '/settings',
    name: 'UserSettings',
    component: UserSettingsPage,
    meta: { title: 'GoAgenda' },
  },
  {
    path: '/set-username',
    name: 'SetUsernamePage',
    component: SetUsernamePage,
    meta: { title: 'GoAgenda' },
  },
  {
    path: '/data-deletion',
    name: 'DataDeletionPage',
    component: DataDeletionPage,
    meta: { title: 'GoAgenda' },
  },
  {
    path: '/about',
    name: 'AboutUs',
    component: AboutUsPage,
    meta: { title: 'About Us' },
  },
  {
    path: '/user/:username',
    name: 'ProfilePage',
    component: ProfilePage,
    meta: { title: 'User Profile' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'GoAgenda';
  next();
});

export default router;
