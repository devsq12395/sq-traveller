<template>
    <div class="flex items-start bg-white shadow-md rounded-lg p-4 mb-4">
      <img
        src="https://via.placeholder.com/150"
        alt="Itinerary Thumbnail"
        class="w-24 h-24 rounded-md mr-4"
      />
      <div>
        <h2 class="text-xl font-bold">{{ name }}</h2>
        <p class="text-gray-600">{{ description }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ItineraryEntry',
    props: {
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
    },
  };
  </script>
  
  <style scoped>
  /* Additional styles if needed */
  </style>
  