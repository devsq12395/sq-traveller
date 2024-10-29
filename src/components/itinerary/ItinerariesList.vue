<template>
  <div>
    <!-- "Create an Itinerary" Button -->
    <button
      @click="showCreatePopup = true"
      class="mb-4 p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Create an Itinerary
    </button>

    <!-- Create Itinerary Popup -->
    <CreateItineraryPopup 
      v-if="showCreatePopup" 
      @close="closePopup" 
      @refresh="loadItineraries" 
    />

    <!-- Display Itineraries -->
    <div v-if="itineraries.length === 0" class="text-gray-500">No itineraries found.</div>
    <div v-else>
      <ItineraryEntry
        v-for="itinerary in itineraries"
        :key="itinerary.id"
        :id="itinerary.id" <!-- Pass the itinerary ID here -->
        :name="itinerary.name"
        :description="itinerary.description"
        :time_start="itinerary.time_start"
        :time_end="itinerary.time_end"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import ItineraryEntry from './ItineraryEntry.vue';
import CreateItineraryPopup from '../popups/CreateItineraryPopup.vue';
import { useUser } from '../../context/UserContext';
import { fetchItineraries } from '../../helpers/itinerary';

export default {
  name: 'ItinerariesList',
  components: {
    ItineraryEntry,
    CreateItineraryPopup,
  },
  setup() {
    const itineraries = ref([]);
    const showCreatePopup = ref(false);
    const user = useUser();

    // Load itineraries from helper
    const loadItineraries = async () => {
      // Ensure user_id is not null
      if (!user.user_id) {
        console.error('User ID is not available.');
        return;
      }

      const { data, error } = await fetchItineraries(user.user_id);

      if (!error) {
        itineraries.value = data;
      } else {
        console.error('Error fetching itineraries:', error.message);
      }
    };

    // Close the popup
    const closePopup = () => {
      showCreatePopup.value = false;
    };

    onMounted(loadItineraries);

    return {
      itineraries,
      showCreatePopup,
      loadItineraries,
      closePopup,
    };
  },
};
</script>

<style scoped>
/* Additional styles if needed */
</style>
