<template>
  <div v-if="isDesktop" @click="goToItinerary" class="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer hover:bg-gray-100 m-1">
    <img :src="img_url" alt="Itinerary Thumbnail" class="w-full object-cover aspect-[4/3]" />

    <!-- Text Section -->
    <div class="p-2">
      <h2 class="text-lg font-bold truncate">{{ name }}</h2>
      <p class="text-gray-600 text-sm truncate">{{ description }}</p>
      <p class="text-xs text-gray-500 mt-1">
        <strong>Days:</strong> {{ days }}<br>
      </p>
    </div>
  </div>
  <div v-else @click="goToItinerary" class="flex bg-white shadow-md rounded-lg overflow-hidden cursor-pointer hover:bg-gray-100 p-2 h-28">
    <img :src="img_url" alt="Itinerary Thumbnail" class="w-1/3 h-full object-cover" />
    <div class="p-2 w-2/3">
      <h2 class="text-lg font-bold">{{ name }}</h2>
      <p class="text-gray-600 text-sm truncate">{{ description.length > 60 ? description.substring(0, 57) + '...' : description }}</p>
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
  computed: {
    isDesktop() {
      return window.innerWidth > 768; // adjust the breakpoint as needed
    },
  },
  created() {
    
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
.h-28 {
  height: 7rem;
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
