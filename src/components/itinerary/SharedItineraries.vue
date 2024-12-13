<template>
  <div class="p-4 bg-blue-100 rounded-lg shadow">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">Shared Itineraries</h2>
      <div class="flex items-center">
        <input
          type="text"
          v-model="searchTerm"
          @input="handleSearch"
          placeholder="Search itineraries..."
          class="w-full px-3 py-2 border rounded"
        />
        <button @click="handleSearch" class="ml-2 p-2 bg-gray-200 rounded hover:bg-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 5.65a7.5 7.5 0 010 10.7z" />
          </svg>
        </button>
      </div>
    </div>
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
          type="button"
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <span class="mx-2">Page {{ currentPage }} of {{ totalPages }}</span>
        <button 
          type="button"
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
import { fetchSharedItineraries, searchItineraries } from '../../helpers/itinerary';

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
    const searchTerm = ref('');

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

    const handleSearch = async () => {
      loading.value = true;
      error.value = null;
      currentPage.value = 1; // Reset to first page on new search

      const { data, error: searchError, pagination } = await searchItineraries(searchTerm.value, {
        page: currentPage.value,
        pageSize: pageSize.value
      });

      if (searchError) {
        error.value = 'Failed to search itineraries';
        console.error(searchError);
      } else {
        itineraries.value = data;
        totalItems.value = pagination.total;
        totalPages.value = pagination.totalPages;
      }

      loading.value = false;
    };

    onMounted(() => loadItineraries(1));

    return {
      itineraries,
      loading,
      error,
      currentPage,
      totalPages,
      changePage,
      searchTerm,
      handleSearch
    };
  }
};
</script>
