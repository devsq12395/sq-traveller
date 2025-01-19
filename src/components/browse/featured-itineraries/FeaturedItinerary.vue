<template>
  <div class="featured-itinerary flex items-center bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform transform hover:-translate-y-1 hover:shadow-lg">
    <img :src="itinerary.img_url" alt="Itinerary Image" class="w-2/5 object-cover" />
    <div class="flex-1 p-5">
      <h2 class="text-xl font-bold text-gray-800 mb-2">{{ itinerary.name }}</h2>
      <p class="text-sm text-gray-600 mb-4">{{ itinerary.description }}</p>
      <ul class="list-none p-0">
        <li class="text-sm text-gray-700 mb-1"><strong>Days:</strong> {{ itinerary.days }}</li>
        <li class="text-sm text-gray-700 mb-1"><strong>Budget:</strong> {{ itinerary.budget }}</li>
        <li class="text-sm text-gray-700 mb-1"><strong>Created by:</strong> {{ itinerary.profiles.username }}</li>
        <li class="text-sm text-gray-700"><strong>Ratings:</strong> {{ itinerary.ratings || "No ratings yet" }}</li>
      </ul>
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
};
</script>

<style scoped>
/* Tailwind CSS is used directly in the template */
</style>
