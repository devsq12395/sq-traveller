<template>
  <div class="min-h-screen p-8 bg-pink-100">
    <h1 class="text-4xl font-bold mb-4 text-center">{{ itineraryName }}</h1>

    <!-- Events List -->
    <div class="bg-blue-100 p-4 rounded shadow-md mb-4">
      <h2 class="text-2xl font-bold mb-2">Day 1</h2>
      <div v-for="event in events" :key="event.id" class="flex items-start bg-yellow-200 p-4 rounded mb-2">
        <img
          src="https://via.placeholder.com/50"
          alt="Event Thumbnail"
          class="w-12 h-12 rounded-md mr-4"
        />
        <div>
          <h3 class="text-lg font-bold">{{ event.location }}</h3>
          <p class="text-sm">
            {{ event.time_start }} - {{ event.time_end }}<br />
            {{ event.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Large Event Space -->
    <div class="bg-blue-300 p-8 rounded shadow-md mb-4">
      <!-- Placeholder for large event content -->
    </div>

    <!-- Export to PDF Button -->
    <button class="p-3 bg-green-500 text-white rounded hover:bg-green-600">
      Export to PDF
    </button>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { fetchItineraryEvents } from '../helpers/itinerary';

export default {
  name: 'ItineraryPage',
  setup() {
    const route = useRoute();
    const itineraryId = route.params.id;
    const itineraryName = ref(''); // Placeholder for the itinerary name
    const events = ref([]);

    // Fetch events for the itinerary
    const loadEvents = async () => {
      const { data, error } = await fetchItineraryEvents(itineraryId);

      if (!error) {
        events.value = data;
        itineraryName.value = data.length > 0 ? data[0].itinerary_name : 'Itinerary';
      } else {
        console.error('Error fetching events:', error.message);
      }
    };

    onMounted(loadEvents);

    return {
      itineraryName,
      events,
    };
  },
};
</script>

<style scoped>
/* Additional styles if needed */
</style>
