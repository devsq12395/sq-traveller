<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-4xl font-bold text-left">My Itineraries</h1>
      <button
        @click="showCreatePopup = true"
        class="p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Create an Itinerary
      </button>
    </div>

    <CreateItineraryPopup 
      v-if="showCreatePopup" 
      @close="closePopup" 
      @refresh="loadItineraries" 
    />

    <div v-if="itineraries.length === 0" class="text-gray-500">No itineraries found.</div>
    <div v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        <ItineraryEntry
          v-for="itinerary in paginatedItineraries"
          :key="itinerary.id"
          :id="itinerary.id"
          :name="itinerary.name"
          :description="itinerary.description"
          :days="itinerary.days"
          :img_url="itinerary.img_url"
        />
      </div>
      
      <!-- Pagination -->
      <div class="mt-6 flex justify-center items-center space-x-2">
        <button 
          @click="currentPage--" 
          :disabled="currentPage === 1"
          class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <span class="mx-2">Page {{ currentPage }} of {{ totalPages }}</span>
        <button 
          @click="currentPage++" 
          :disabled="currentPage >= totalPages"
          class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import ItineraryEntry from './ItineraryEntry.vue';
import CreateItineraryPopup from '../popups/CreateItineraryPopup.vue';
import { useUser } from '../../context/UserContext';
import { fetchItineraries } from '../../helpers/itinerary';

export default {
  name: 'ItinerariesList',
  components: {
    ItineraryEntry,
    CreateItineraryPopup,
  },
  setup() {
    const itineraries = ref([]);
    const showCreatePopup = ref(false);
    const currentPage = ref(1);
    const itemsPerPage = 12; // Number of items to show per page
    const user = useUser();

    const totalPages = computed(() => Math.ceil(itineraries.value.length / itemsPerPage));
    
    const paginatedItineraries = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return itineraries.value.slice(start, end);
    });

    const loadItineraries = async () => {
      if (!user.user_id) {
        console.error('User ID is not available.');
        return;
      }

      const { data, error } = await fetchItineraries(user.user_id);

      if (!error) {
        itineraries.value = data;
      } else {
        console.error('Error fetching itineraries:', error.message);
      }
    };

    const closePopup = () => {
      showCreatePopup.value = false;
    };

    onMounted(loadItineraries);

    return {
      itineraries,
      showCreatePopup,
      loadItineraries,
      closePopup,
      currentPage,
      totalPages,
      paginatedItineraries,
    };
  },
};
</script>

<style scoped>
/* Styles for grid layout */
.grid {
  display: grid;
  gap: 0.5rem; /* Reduce the gap between thumbnails */
}
</style>
