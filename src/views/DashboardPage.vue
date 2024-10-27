<template>
    <div class="min-h-screen p-8 bg-gray-100">
      <h1 class="text-4xl font-bold mb-6">My Itineraries</h1>
      <ItinerariesList />
    </div>
  </template>
  
  <script>
  import ItinerariesList from '../components/itinerary/ItinerariesList.vue';
  
  export default {
    name: 'DashboardPage',
    components: {
      ItinerariesList,
    },
  };
  </script>
  
  <style scoped>
  /* Additional styles if needed */
  </style>
  