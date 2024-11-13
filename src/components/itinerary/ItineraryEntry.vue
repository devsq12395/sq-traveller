<template>
  <div 
    @click="goToItinerary"
    class="w-60 bg-white shadow-md rounded-lg overflow-hidden cursor-pointer hover:bg-gray-100 m-2"
  >
    <img
      :src="img_url"
      alt="Itinerary Thumbnail"
      class="w-full h-40 object-cover"
    />
    <div class="p-4">
      <h2 class="text-lg font-bold truncate">{{ name }}</h2>
      <p class="text-gray-600 text-sm truncate">{{ description }}</p>
      <p class="text-xs text-gray-500 mt-2">
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
    img_url: {
      type: String,
      required: false,
      default: 'https://via.placeholder.com/150',
    },
  },
  methods: {
    formatDate(date) {
      if (!date) return 'Invalid Date';
      // Use a more robust date parsing
      const parsedDate = new Date(Date.parse(date));
      return isNaN(parsedDate) ? 'Invalid Date' : parsedDate.toLocaleString();
    },
    goToItinerary() {
      this.$router.push(`/itinerary/${this.id}`);
    },
  },
};
</script>

<style scoped>
/* Adjust the width and height for better thumbnail view */
.w-60 {
  width: 15rem;
}
.h-40 {
  height: 10rem;
}
.truncate {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
