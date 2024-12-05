<template>
  <div class="p-4 bg-blue-100 rounded-lg shadow">
    <h2 class="text-2xl font-bold mb-4">Shared Itineraries</h2>
    <div v-if="loading" class="text-center py-4">
      <p>Loading shared itineraries...</p>
    </div>
    <div v-else-if="error" class="text-center py-4 text-red-600">
      <p>{{ error }}</p>
    </div>
    <div v-else-if="itineraries.length === 0" class="text-center py-4 text-gray-600">
      <p>No shared itineraries available.</p>
    </div>
    <div v-else>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
        <SharedItinerariesEntry
          v-for="itinerary in itineraries"
          :key="itinerary.id"
          :itinerary="itinerary"
        />
      </div>
      
      <!-- Pagination Controls -->
      <div class="mt-6 flex justify-center items-center space-x-2">
        <button 
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <span class="mx-2">Page {{ currentPage }} of {{ totalPages }}</span>
        <button 
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import SharedItinerariesEntry from './SharedItinerariesEntry.vue';
import { fetchSharedItineraries } from '../../helpers/itinerary';

export default {
  name: 'SharedItineraries',
  components: {
    SharedItinerariesEntry
  },
  setup() {
    const itineraries = ref([]);
    const loading = ref(true);
    const error = ref(null);
    const currentPage = ref(1);
    const pageSize = ref(12);
    const totalItems = ref(0);
    const totalPages = ref(0);

    const loadItineraries = async (page = 1) => {
      loading.value = true;
      error.value = null;
      
      const { data, error: fetchError, pagination } = await fetchSharedItineraries({
        page,
        pageSize: pageSize.value
      });
      
      if (fetchError) {
        error.value = 'Failed to load shared itineraries';
        console.error(fetchError);
      } else {
        itineraries.value = data;
        totalItems.value = pagination.total;
        totalPages.value = pagination.totalPages;
        currentPage.value = pagination.page;
      }
      
      loading.value = false;
    };

    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        loadItineraries(page);
      }
    };

    onMounted(() => loadItineraries(1));

    return {
      itineraries,
      loading,
      error,
      currentPage,
      totalPages,
      changePage
    };
  }
};
</script>
