<template>
  <div class="min-h-screen p-8 pt-20 bg-gray-100">
    <div class="flex flex-col space-y-6">
      <!-- Header Section -->
      <div class="flex justify-between items-center pb-4 border-b border-gray-300">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">Dashboard</h1>
        </div>
      </div>
      
      <!-- Itineraries Section -->
      <div class="border-b border-gray-300 pb-6">
        <ItinerariesList />
      </div>

      <!-- Shared Itineraries Section -->
      <div class="pb-6">
        <SharedItineraries />
      </div>
    </div>
  </div>
</template>

<script>
import ItinerariesList from '../components/itinerary/ItinerariesList.vue';
import SharedItineraries from '../components/itinerary/SharedItineraries.vue';

export default {
  name: 'DashboardPage',
  components: {
    ItinerariesList,
    SharedItineraries,
  },
  methods: {
    
  },
};
</script>

<style scoped>
/* Additional styles if needed */
</style>