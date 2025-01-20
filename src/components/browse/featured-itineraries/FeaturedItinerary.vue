<template>
  <div class="featured-itinerary flex flex-col items-center cursor-pointer rounded-lg shadow" :style="{ height: '460px', maxHeight: '460px', width: '500px', maxWidth: '500px', backgroundImage: `url(${itinerary.img_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }">
    <div class="flex-1 p-5 text-left bg-white bg-opacity-75 p-4 w-full" style="margin-top: 60%;">
      <h2 class="text-2xl font-bold text-gray-800 mb-2">{{ itinerary.name }}</h2>
      <ul class="list-none p-0">
        <li class="text-sm text-gray-700 mb-1"><strong>Created by:</strong> {{ itinerary.profiles.username }}</li>
      </ul>
      <p class="text-sm text-gray-600 mb-4">{{ itinerary.description.length > 150 ? itinerary.description.substring(0, 45) + '...' : itinerary.description }}</p>
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
