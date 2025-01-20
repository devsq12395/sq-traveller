<template>
  <div class="bg-blue-100 rounded-lg shadow flex flex-col items-center my-5 w-1/3 max-w-1/3 p-3" style="height: 400px;">
    <h2 class="text-2xl mt-2 font-bold mb-3">Featured Itineraries</h2>

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
      <FeaturedItinerary :itinerary="currentItinerary" />
      <div class="pagination flex items-center mt-3">
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
