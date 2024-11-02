<template>
  <div class="flex min-h-screen p-8 bg-pink-100">
    <!-- Sidebar for Event List -->
    <div class="w-1/3 bg-blue-100 rounded-lg flex flex-col">
      <!-- Fixed Header Section -->
      <div class="p-4 border-b border-gray-300">
        <div class="flex justify-between items-center mb-4">
          <h1 class="text-2xl font-semibold">{{ itineraryName }}</h1>
          <!-- Buttons Container -->
          <div class="flex space-x-4">
            <!-- Back to Dashboard Button -->
            <button
              @click="goToDashboard"
              class="p-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              ← Back to Dashboard
            </button>
            <!-- Create Event Button -->
            <button
              @click="showCreateEventPopup = true"
              class="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Create Event
            </button>
          </div>
        </div>
      </div>

      <!-- Scrollable Events List Section -->
      <div class="flex-1 overflow-y-auto p-4">
        <div v-for="(dayEvents, index) in daysWithEvents" :key="index" class="mb-6 bg-white rounded-lg shadow p-4">
          <h2 class="text-xl font-bold mb-2 text-center">{{ `Day ${index + 1}` }}</h2>
          <div v-for="event in dayEvents" :key="event.id" class="mb-2">
            <EventEntry
              :location="event.location"
              :time_start="event.time_start"
              :time_end="event.time_end"
              :description="event.description"
              :isSelected="selectedEventId === event.id"
              @select-event="selectEvent(event.id)"
            />
          </div>
        </div>
      </div>

      <!-- Fixed Footer Section -->
      <div class="p-4 border-t border-gray-300">
        <button class="p-3 w-full bg-green-500 text-white rounded hover:bg-green-600">
          Export to PDF
        </button>
      </div>
    </div>

    <!-- Main content area for selected Event -->
    <div class="w-2/3 bg-purple-50 p-4 rounded-lg ml-4 flex flex-col">
      <EventInfo v-if="selectedEvent" :event="selectedEvent" />
    </div>

    <!-- Create Event Popup -->
    <CreateEventPopup
      v-if="showCreateEventPopup"
      :itineraryId="itineraryId"
      @close="closeCreateEventPopup"
      @refresh="loadEvents"
    />
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchItineraryEvents } from '../helpers/itinerary';
import EventEntry from '../components/events/EventEntry.vue';
import EventInfo from '../components/events/EventInfo.vue';
import CreateEventPopup from '../components/popups/CreateEventPopup.vue';

export default {
  name: 'ItineraryPage',
  components: {
    EventEntry,
    EventInfo,
    CreateEventPopup,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const itineraryId = route.params.id;
    const itineraryName = ref('');
    const events = ref([]);
    const selectedEventId = ref(null);
    const showCreateEventPopup = ref(false);

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

    const selectEvent = (id) => {
      selectedEventId.value = id;
    };

    const closeCreateEventPopup = () => {
      showCreateEventPopup.value = false;
    };

    // Navigate back to the dashboard
    const goToDashboard = () => {
      router.push('/dashboard');
    };

    // Group events by day (this is a placeholder grouping method)
    const daysWithEvents = computed(() => {
      const groupedEvents = {};
      events.value.forEach(event => {
        const day = new Date(event.time_start).toDateString();
        if (!groupedEvents[day]) groupedEvents[day] = [];
        groupedEvents[day].push(event);
      });
      return Object.values(groupedEvents);
    });

    const selectedEvent = computed(() =>
      events.value.find((event) => event.id === selectedEventId.value)
    );

    onMounted(loadEvents);

    return {
      itineraryId,
      itineraryName,
      events,
      selectedEventId,
      showCreateEventPopup,
      loadEvents,
      closeCreateEventPopup,
      selectEvent,
      selectedEvent,
      goToDashboard,
      daysWithEvents,
    };
  },
};
</script>

<style scoped>
/* Additional styles for fixed sections and scrollable content */
.overflow-y-auto {
  max-height: calc(100vh - 16rem); /* Adjust to ensure scrolling within the center */
}
</style>
