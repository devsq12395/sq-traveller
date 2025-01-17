<template>
    <div class="min-h-screen p-8 pt-40 bg-gray-100">
      <div class="flex flex-col space-y-6">
        <!-- Header Section -->
        <div class="flex justify-between items-center pb-4 border-b border-gray-300">
          <div>
            <h1 class="text-3xl font-bold text-gray-800">Dashboard</h1>
          </div>
        </div>
        
        <!-- Itineraries Section -->
        <div class="border-b border-gray-300 pb-6">
          <ItinerariesList ref="itinerariesListRef" />
        </div>
  
        <!-- Public Itineraries Section -->
        <div class="pb-6">
          <SharedItineraries />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, watch } from 'vue';
  import ItinerariesList from '../components/itinerary/ItinerariesList.vue';
  import SharedItineraries from '../components/itinerary/SharedItineraries.vue';
  import { useUser } from '../context/UserContext';
  
  export default {
    name: 'BrowsePage',
    components: {
      ItinerariesList,
      SharedItineraries,
    },
    setup() {
      const itinerariesListRef = ref(null);
      const user = useUser();
  
      // Watch for changes in user_id and reload itineraries
      watch(() => user.user_id, (newUserId) => {
        if (newUserId && itinerariesListRef.value) {
          itinerariesListRef.value.loadItineraries();
        }
      });
  
      return {
        itinerariesListRef
      };
    }
  };
  </script>
  
  <style scoped>
    /* Additional styles if needed */
  </style>