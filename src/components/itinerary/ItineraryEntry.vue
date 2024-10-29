<template>
  <div 
    @click="goToItinerary"
    class="flex items-start bg-white shadow-md rounded-lg p-4 mb-4 cursor-pointer hover:bg-gray-100"
  >
    <img
      src="https://via.placeholder.com/150"
      alt="Itinerary Thumbnail"
      class="w-24 h-24 rounded-md mr-4"
    />
    <div>
      <h2 class="text-xl font-bold">{{ name }}</h2>
      <p class="text-gray-600">{{ description }}</p>
      <p class="text-sm text-gray-500 mt-2">
        <strong>Start:</strong> {{ formatDate(time_start) }}<br>
        <strong>End:</strong> {{ formatDate(time_end) }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ItineraryEntry',
  props: {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    time_start: {
      type: String,
      required: true,
    },
    time_end: {
      type: String,
      required: true,
    },
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleString();
    },
    goToItinerary() {
      this.$router.push(`/itinerary/${this.id}`);
    },
  },
};
</script>

<style scoped>
/* Additional styles if needed */
</style>
