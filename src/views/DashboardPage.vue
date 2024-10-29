<template>
  <div class="min-h-screen p-8 bg-gray-100">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-4xl font-bold">My Itineraries</h1>
      <!-- Logout Button -->
      <button
        @click="handleLogout"
        class="p-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
    
    <!-- Itineraries List -->
    <ItinerariesList />
  </div>
</template>

<script>
import ItinerariesList from '../components/itinerary/ItinerariesList.vue';
import { logout } from '../helpers/authService';
import { clearUser } from '../context/UserContext';

export default {
  name: 'DashboardPage',
  components: {
    ItinerariesList,
  },
  methods: {
    async handleLogout() {
      const error = await logout();

      if (!error) {
        clearUser(); // Clear user data from context and local storage
        this.$router.push('/'); // Redirect to login page
      } else {
        console.error('Error during logout:', error.message);
      }
    },
  },
};
</script>

<style scoped>
/* Additional styles if needed */
</style>
