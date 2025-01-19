<template>
  <div class="p-4 bg-blue-100 rounded-lg shadow"></div>
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-2xl font-bold">Featured Itineraries</h2>

    <div v-if="loading" class="text-center py-4">
      <p>Loading public itineraries...</p>
    </div>
    <div v-else-if="error" class="text-center py-4 text-red-600">
      <p>{{ error }}</p>
    </div>
    <div v-else-if="itineraries.length === 0" class="text-center py-4 text-gray-600">
      <p>No featured itineraries available.</p>
    </div>

    <div v-else>
      <div class="featured-itineraries">
        <FeaturedItinerary :itinerary="currentItinerary" />
        <div class="pagination">
          <button @click="prevItinerary">&lt;</button>
          <span v-for="(dot, index) in itineraries" :key="index" :class="{'active-dot': index === currentIndex}">
            •
          </span>
          <button @click="nextItinerary">&gt;</button>
        </div>
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
      this.error = 'Failed to load itineraries';
      console.error('Failed to load itineraries:', error);
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
.featured-itineraries {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
}
.pagination {
  display: flex;
  align-items: center;
  margin-top: 10px;
}
button {
  background-color: white;
  border: none;
  cursor: pointer;
  font-size: 18px;
  margin: 0 10px;
}
.active-dot {
  color: black;
  font-size: 24px;
}
</style>