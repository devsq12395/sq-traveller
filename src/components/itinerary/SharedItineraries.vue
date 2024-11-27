<template>
  <div class="p-4 bg-white rounded-lg shadow">
    <h2 class="text-2xl font-bold mb-4">Shared Itineraries</h2>
    <div v-if="loading" class="text-center py-4">
      <p>Loading shared itineraries...</p>
    </div>
    <div v-else-if="error" class="text-center py-4 text-red-600">
      <p>{{ error }}</p>
    </div>
    <div v-else-if="itineraries.length === 0" class="text-center py-4 text-gray-600">
      <p>No shared itineraries available.</p>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <SharedItinerariesEntry
        v-for="itinerary in itineraries"
        :key="itinerary.id"
        :itinerary="itinerary"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import SharedItinerariesEntry from './SharedItinerariesEntry.vue';
import { fetchSharedItineraries } from '../../helpers/itinerary';

export default {
  name: 'SharedItineraries',
  components: {
    SharedItinerariesEntry
  },
  setup() {
    const itineraries = ref([]);
    const loading = ref(true);
    const error = ref(null);

    const loadItineraries = async () => {
      loading.value = true;
      error.value = null;
      
      const { data, error: fetchError } = await fetchSharedItineraries();
      
      if (fetchError) {
        error.value = 'Failed to load shared itineraries';
        console.error(fetchError);
      } else {
        itineraries.value = data;
      }
      
      loading.value = false;
    };

    onMounted(loadItineraries);

    return {
      itineraries,
      loading,
      error
    };
  }
};
</script>
