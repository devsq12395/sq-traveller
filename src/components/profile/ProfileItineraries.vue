<template>
  <div class="profile-itineraries h-full rounded-lg w-full p-5">
    <h2 class="text-4xl font-bold mb-4 text-left p-5">{{user.username}}'s Public Itineraries</h2>
    <div class="flex flex-wrap">
      <div v-for="itinerary in paginatedItineraries" :key="itinerary.id" class="mb-2 max-w-md flex-1">
        <SharedItinerariesEntry :itinerary="itinerary" />
      </div>
    </div>
    <div class="flex justify-center items-center mt-4 space-x-4">
      <button @click="prevPage" :disabled="currentPage === 1" class="px-4 py-2 bg-blue-500 text-white rounded">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="px-4 py-2 bg-blue-500 text-white rounded">Next</button>
    </div>
  </div>
</template>

<script>
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
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.itineraries.slice(start, end);
    },
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
</style>
