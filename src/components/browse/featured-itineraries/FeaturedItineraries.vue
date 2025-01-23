<template>
  <div class="bg-blue-100 rounded-lg shadow flex flex-col items-center z-20 w-[25%] min-w-[25%] h-[700px] min-h-[700px]">
    <h2 class="text-2xl mt-4 font-bold">Featured Itineraries</h2>

    <hr class="w-[90%] border-t border-gray-400 my-4" />

    <div v-if="loading" class="loading-state">
      <p>Loading featured itineraries...</p>
    </div>
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
    </div>
    <div v-else-if="itineraries.length === 0" class="empty-state">
      <p>No featured itineraries available.</p>
    </div>
    <div v-else>
      <div class="w-full min-w-full max-w-full">
        <FeaturedItinerary :itinerary="currentItinerary" />
      </div>

      <!-- Pagination -->
      <div class="pagination flex items-center justify-center mt-3">
        <button @click="prevItinerary" class="bg-white border rounded-full p-2 mx-2 shadow hover:bg-gray-100">&lt;</button>
        <span v-for="(dot, index) in itineraries" :key="index" :class="{'text-black text-lg': index === currentIndex, 'text-gray-400': index !== currentIndex}">
          •
        </span>
        <button @click="nextItinerary" class="bg-white border rounded-full p-2 mx-2 shadow hover:bg-gray-100">&gt;</button>
      </div>
    </div>
  </div>
</template>

<script>
import { getAllFeaturedItineraries } from '@/helpers/itineraryFeatured';
import FeaturedItinerary from './FeaturedItinerary.vue';

export default {
  components: { FeaturedItinerary },
  data() {
    return {
      itineraries: [],
      currentIndex: 0,
      loading: false,
      error: null,
    };
  },
  computed: {
    currentItinerary() {
      return this.itineraries[this.currentIndex] || {};
    },
  },
  async created() {
    this.loading = true;
    try {
      this.itineraries = await getAllFeaturedItineraries();
    } catch (error) {
      this.error = "Failed to load itineraries";
    } finally {
      this.loading = false;
    }
  },
  methods: {
    nextItinerary() {
      if (this.currentIndex < this.itineraries.length - 1) {
        this.currentIndex++;
      }
    },
    prevItinerary() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
      }
    },
  },
};
</script>

<style scoped>
/* Tailwind CSS is used directly in the template */
</style>
