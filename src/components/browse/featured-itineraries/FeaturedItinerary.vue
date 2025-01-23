<template>
  <div @click="navigateToItinerary" class="bg-purple-50 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
    <img :src="itinerary.img_url" :alt="itinerary.name" class="w-full object-cover aspect-[4/3]" />

    <!-- Text Section -->
    <div class="p-4">
      <h3 class="text-xl font-semibold mb-2">{{ itinerary.name }}</h3>
      <p class="text-gray-600 mb-2">{{ itinerary.description }}</p>
      <div class="flex justify-between items-center text-sm text-gray-500">
        <span>By {{ itinerary.profiles.username }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    itinerary: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    navigateToItinerary() {
      this.$router.push(`/itinerary/${this.itinerary.id}`);
    },
  }
};
</script>

<style scoped>
/* Tailwind CSS is used directly in the template */
</style>
