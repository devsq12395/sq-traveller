<template>
  <!-- Desktop View -->
  <div v-if="isDesktop" class="profile-itineraries rounded-lg w-full p-5">
    <h2 class="text-4xl font-bold mb-4 text-left p-5">{{user.username}}'s Public Itineraries</h2>
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
      <div v-for="itinerary in paginatedItineraries" :key="itinerary.id">
        <SharedItinerariesEntry :itinerary="itinerary" class="h-full"/>
      </div>
    </div>
    <div class="flex justify-center items-center mt-4 space-x-4">
      <button @click="prevPage" :disabled="currentPage === 1" class="px-4 py-2 bg-blue-500 text-white rounded">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="px-4 py-2 bg-blue-500 text-white rounded">Next</button>
    </div>
  </div>

  <!-- Mobile View -->
  <div v-else class="profile-itineraries rounded-lg w-full p-5">
    <h2 class="text-xl font-bold mb-4 text-left">{{user.username}}'s Public Itineraries</h2>
    <hr class="border-t border-gray-300 my-4">

    <!-- Pagination Controls -->
    <div class="flex justify-center items-center mt-4 space-x-4">
      <button @click="prevPage" :disabled="currentPage === 1" class="px-4 py-2 bg-blue-500 text-white rounded">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="px-4 py-2 bg-blue-500 text-white rounded">Next</button>
    </div>

    <!-- Itinerary Entries -->
    <div class="grid grid-cols-1 gap-4 mb-4">
      <div v-for="itinerary in paginatedItineraries" :key="itinerary.id">
        <SharedItinerariesEntry :itinerary="itinerary" class="h-full"/>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div class="flex justify-center items-center mt-4 space-x-4">
      <button @click="prevPage" :disabled="currentPage === 1" class="px-4 py-2 bg-blue-500 text-white rounded">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="px-4 py-2 bg-blue-500 text-white rounded">Next</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import SharedItinerariesEntry from '../itinerary/SharedItinerariesEntry.vue';

export default {
  name: 'ProfileItineraries',
  components: {
    SharedItinerariesEntry,
  },
  props: {
    user: { type: Object, required: true },
    itineraries: { type: Array, required: true },
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 6,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.itineraries.length / this.itemsPerPage);
    },
    paginatedItineraries() {
      const sortedItineraries = [...this.itineraries].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return sortedItineraries.slice(start, end);
    },
  },
  setup() {
    const isDesktop = ref(window.innerWidth >= 640);

    const checkWindowSize = () => {
      isDesktop.value = window.innerWidth >= 640;
    };
    onMounted(() => {
      window.addEventListener('resize', checkWindowSize);
      checkWindowSize();
    });
    onUnmounted(() => {
      window.removeEventListener('resize', checkWindowSize);
    });

    return {
      isDesktop
    };
  },
  methods: {
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
  },
};
</script>

<style scoped>
.profile-itineraries .flex-wrap > div {
  flex: 1 0 21%; /* Adjust the percentage as needed for spacing */
  max-width: 21%;
  box-sizing: border-box;
}
</style>
