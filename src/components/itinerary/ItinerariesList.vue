<template>
  <div v-if="isDesktop" :class="{'overflow-hidden': showCreatePopup}" class="bg-blue-100 rounded-lg shadow-lg p-6">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-4xl font-bold text-left">My Itineraries</h1>
      <button
        v-if="isLoggedIn"
        @click="showCreatePopup = true"
        class="p-3 bg-green-500 text-white rounded hover:bg-blue-600"
      >
        Create an Itinerary
      </button>
    </div>

    <hr class="my-4 border-t border-gray-400" />

    <div v-if="!isLoggedIn" class="text-gray-500">Log in to view your itineraries.</div>
    <div v-else-if="itineraries.length === 0" class="text-gray-500">No itineraries found.</div>
    <div v-else class="flex flex-col space-y-4 gap-4">
      <!-- Pagination -->
      <PaginationControl 
        :currentPage="currentPage" 
        :maxPage="totalPages" 
        @previous-page="currentPage--" 
        @next-page="currentPage++"
      />

      <!-- Main Body -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 grid-rows-4 gap-2">
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
      <PaginationControl 
        :currentPage="currentPage" 
        :maxPage="totalPages" 
        @previous-page="currentPage--" 
        @next-page="currentPage++"
      />
    </div>

    <CreateItineraryPopup 
      v-if="showCreatePopup" 
      @close="closePopup" 
      @refresh="loadItineraries" 
    />
  </div>
  <div v-else :class="{'overflow-hidden': showCreatePopup}" class="bg-blue-100 rounded-lg shadow-lg p-6 w-full md:w-3/4 mx-auto">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold text-left">My Itineraries</h1>
      <button
        @click="showCreatePopup = true"
        class="p-2 bg-green-500 text-white rounded text-sm hover:bg-green-600"
      >
        Create
      </button>
    </div>

    <hr class="my-4 border-t border-gray-400" />

    <div v-if="itineraries.length === 0" class="text-gray-500">No itineraries found.</div>
    <div v-else>
      <!-- Pagination -->
      <PaginationControl 
        :currentPage="currentPage" 
        :maxPage="totalPages" 
        @previous-page="currentPage--" 
        @next-page="currentPage++"
      />

      <!-- Main Body -->
      <div class="flex flex-col space-y-4">
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
      <PaginationControl 
        :currentPage="currentPage" 
        :maxPage="totalPages" 
        @previous-page="currentPage--" 
        @next-page="currentPage++"
      />

      <CreateItineraryPopup 
        v-if="showCreatePopup" 
        @close="closePopup" 
        @refresh="loadItineraries" 
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import ItineraryEntry from './ItineraryEntry.vue';
import CreateItineraryPopup from '../popups/CreateItineraryPopup.vue';
import { useUser } from '../../context/UserContext';
import { fetchItineraries } from '../../helpers/itinerary';
import PaginationControl from '../common/PaginationControl.vue';

export default {
  name: 'ItinerariesList',
  components: {
    ItineraryEntry,
    CreateItineraryPopup,
    PaginationControl
  },
  setup() {
    const itineraries = ref([]);
    const showCreatePopup = ref(false);
    const currentPage = ref(1);
    const itemsPerPage = 18; // Number of items to show per page
    const user = useUser();
    const isLoggedIn = ref(false);
    const windowWidth = ref(window.innerWidth);
    const isDesktop = computed(() => windowWidth.value >= 768);

    const totalPages = computed(() => Math.ceil(itineraries.value.length / itemsPerPage));
    
    const paginatedItineraries = computed(() => {
      const sortedItineraries = [...itineraries.value].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return sortedItineraries.slice(start, end);
    });

    const loadItineraries = async () => {
      if (!user.user_id) {
        console.error('User ID is not available.');
        return;
      }

      const { data, error } = await fetchItineraries(user.user_id);

      if (!error) {
        itineraries.value = data;
        isLoggedIn.value = true;
      } else {
        console.error('Error fetching itineraries:', error.message);
      }
    };

    const closePopup = () => {
      showCreatePopup.value = false;
    };

    window.addEventListener('resize', () => {
      windowWidth.value = window.innerWidth;
    });

    onMounted(loadItineraries);

    return {
      itineraries,
      showCreatePopup,
      loadItineraries,
      closePopup,
      currentPage,
      totalPages,
      paginatedItineraries,
      isDesktop,
      isLoggedIn
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
.overflow-hidden {
  overflow: hidden;
}
</style>
