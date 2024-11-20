<template>
  <div class="flex min-h-screen p-8 pt-20 bg-pink-100">
    <!-- Sidebar for Event List -->
    <div class="w-1/3 bg-blue-100 rounded-lg flex flex-col">
      <!-- Add itinerary image and description -->
      <div class="p-4 border-b border-gray-300">
        <div class="flex items-center mb-4">
          <img :src="itineraryImgUrl" alt="Itinerary Image" class="w-24 h-24 mr-4" />
          <div class="flex-grow">
            <div class="flex justify-between items-start">
              <div>
                <h1 class="text-2xl font-semibold">{{ itineraryName }}</h1>
                <p class="text-sm text-gray-600">{{ itineraryDescription }}</p>
              </div>
              <div class="relative">
                <button
                  @click="showSettingsPopup = !showSettingsPopup"
                  class="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
                >
                  <span class="text-xl">⋮</span>
                </button>
                <!-- Settings Popup -->
                <div
                  v-if="showSettingsPopup"
                  class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                >
                  <button
                    @click="goToSettings"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
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

      <!-- Scrollable Events List Section -->
      <div class="flex-1 overflow-y-auto p-4">
        <div
          v-for="(dayEvents, index) in eventsGroupedByDay"
          :key="index"
          class="mb-6 bg-white rounded-lg shadow p-4"
        >
          <h2 class="text-xl font-bold mb-2 text-center">
            Day {{ dayEvents[0].day }}
          </h2>
          <div v-for="event in dayEvents" :key="event.id" class="mb-2">
            <EventEntry
              :location="event.location"
              :day="event.day"
              :description="event.description"
              :isSelected="selectedEventId === event.id"
              :imgUrl="event.img_url"
              :time_start="event.time_start"
              :time_end="event.time_end"
              @select-event="selectEvent(event.id)"
            />
          </div>
        </div>
      </div>

      <!-- Fixed Footer Section -->
      <div class="p-4 border-t border-gray-300"></div>
    </div>

    <!-- Main content area for selected Event -->
    <div class="w-2/3 bg-purple-50 p-4 rounded-lg ml-4 flex flex-col">
      <EventInfo
        v-if="selectedEvent"
        :event="selectedEvent"
        @show-add-note="showCreateNotePopup = true"
        @show-add-todo="showCreateTodoPopup = true"
        @show-add-budget="showCreateBudgetPopup = true"
      />
    </div>

    <!-- Create Event Popup -->
    <CreateEventPopup
      v-if="showCreateEventPopup"
      :itineraryId="itineraryId"
      @close="closeCreateEventPopup"
      @refresh="loadEvents"
    />

    <!-- Create Notes Popup -->
    <CreateNotePopup
      v-if="showCreateNotePopup"
      @close="showCreateNotePopup = false"
      @refresh="loadEvents"
    />

    <!-- Create Todo Popup -->
    <CreateTodoPopup
      v-if="showCreateTodoPopup"
      @close="showCreateTodoPopup = false"
      @refresh="loadEvents"
    />

    <!-- Create Budget Popup -->
    <CreateBudgetPopup
      v-if="showCreateBudgetPopup"
      @close="showCreateBudgetPopup = false"
      @refresh="loadEvents"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchItinerary } from '../helpers/itinerary';
import { fetchItineraryEvents } from '../helpers/event';
import { setEventId } from '../context/UserContext';
import EventEntry from '../components/events/EventEntry.vue';
import EventInfo from '../components/events/EventInfo.vue';
import CreateEventPopup from '../components/popups/CreateEventPopup.vue';
import CreateNotePopup from '../components/popups/CreateNotePopup.vue';
import CreateTodoPopup from '../components/popups/CreateTodoPopup.vue';
import CreateBudgetPopup from '../components/popups/CreateBudgetPopup.vue';

export default {
  name: 'ItineraryPage',
  components: {
    EventEntry,
    EventInfo,
    CreateEventPopup,
    CreateNotePopup,
    CreateTodoPopup,
    CreateBudgetPopup
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const itineraryId = route.params.id;
    const itineraryName = ref('');
    const itineraryDescription = ref('');
    const itineraryImgUrl = ref('');
    const events = ref([]);
    const selectedEventId = ref(null);
    const showCreateEventPopup = ref(false);
    const showCreateNotePopup = ref(false);
    const showCreateTodoPopup = ref(false);
    const showCreateBudgetPopup = ref(false);
    const showSettingsPopup = ref(false);

    // Fetch itinerary details and events
    const loadItinerary = async () => {
      const { data, error } = await fetchItinerary(itineraryId);
      if (!error) {
        itineraryName.value = data.name;
        itineraryDescription.value = data.description;
        itineraryImgUrl.value = data.img_url;
      } else {
        console.error('Error fetching itinerary:', error.message);
      }
    };

    const loadEvents = async () => {
      const { data, error } = await fetchItineraryEvents(itineraryId);
      if (!error) {
        events.value = data;
      } else {
        console.error('Error fetching events:', error.message);
      }
    };

    onMounted(() => {
      loadItinerary();
      loadEvents();
    });

    const selectEvent = (id) => {
      selectedEventId.value = id;
      setEventId(id); // Save selected event ID in the context
    };

    const closeCreateEventPopup = () => {
      showCreateEventPopup.value = false;
    };

    const goToDashboard = () => {
      router.push('/dashboard');
    };

    const goToSettings = () => {
      showSettingsPopup.value = false;
      router.push(`/itinerary/${route.params.id}/settings`);
    };

    const eventsGroupedByDay = computed(() => {
      const grouped = events.value.reduce((acc, event) => {
        const dayKey = event.day;
        if (!acc[dayKey]) acc[dayKey] = [];
        acc[dayKey].push(event);
        return acc;
      }, {});
      return Object.values(grouped).sort((a, b) => a[0].day - b[0].day);
    });

    const selectedEvent = computed(() =>
      events.value.find((event) => event.id === selectedEventId.value)
    );

    return {
      itineraryId,
      itineraryName,
      itineraryDescription,
      itineraryImgUrl,
      eventsGroupedByDay,
      selectedEventId,
      showCreateEventPopup,
      showCreateNotePopup,
      showCreateTodoPopup,
      showCreateBudgetPopup,
      showSettingsPopup,
      loadEvents,
      closeCreateEventPopup,
      selectEvent,
      selectedEvent,
      goToDashboard,
      goToSettings,
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
