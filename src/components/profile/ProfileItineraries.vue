<template>
  <div class="profile-itineraries w-2/3 p-5">
    <h2 class="text-xl font-bold mb-4">Shared Itineraries</h2>
    <ul class="list-disc list-inside">
      <li v-for="itinerary in itineraries" :key="itinerary.id" class="mb-2">
        {{ itinerary.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ProfileItineraries',
  props: {
    itineraries: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>

</style>
