<template>
  <div 
    @click="goToItinerary"
    class="w-60 bg-white shadow-md rounded-lg overflow-hidden cursor-pointer hover:bg-gray-100 m-1"
  >
    <img
      :src="img_url"
      alt="Itinerary Thumbnail"
      class="w-full h-40 object-cover"
    />
    <div class="p-2">
      <h2 class="text-lg font-bold truncate">{{ name }}</h2>
      <p class="text-gray-600 text-sm truncate">{{ description }}</p>
      <p class="text-xs text-gray-500 mt-1">
        <strong>Days:</strong> {{ days }}<br>
      </p>
    </div>
  </div>
</template>

<script>
import { setItinerary } from '../../context/UserContext.js';

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
    days: {
      type: Int32Array,
      required: true,
    },
    img_url: {
      type: String,
      required: false,
      default: 'https://via.placeholder.com/150',
    },
  },
  methods: {
    goToItinerary() {
      setItinerary({ id: this.id });
      this.$router.push(`/itinerary/${this.id}`);
    },
  },
};
</script>

<style scoped>
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
.m-1 {
  margin: 0.25rem; /* Reduce the margin to decrease spacing */
}
.p-2 {
  padding: 0.5rem; /* Reduce the padding inside the card */
}
</style>
