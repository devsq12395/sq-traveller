<template>
  <div class="min-h-screen p-8 pt-20 bg-gray-100">
    <div class="flex flex-col space-y-6">
      <!-- Header Section -->
      <div class="flex justify-between items-center pb-4 border-b border-gray-300">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p class="text-gray-600 mt-1">Manage your travel plans</p>
        </div>
        <button
          @click="handleLogout"
          class="p-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      
      <!-- Itineraries Section -->
      <div class="border-b border-gray-300 pb-6">
        <ItinerariesList />
      </div>
    </div>
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
