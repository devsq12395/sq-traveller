<template>
  <div class="flex flex-col min-h-screen pt-20 bg-pink-100">
    <div class="flex p-8">
      <!-- Sidebar for Event List -->
      <ItineraryInfo
        :itineraryId="itineraryId"
        :itineraryImgUrl="itineraryImgUrl"
        :itineraryName="itineraryName"
        :itineraryDescription="itineraryDescription"
        :eventsGroupedByDay="eventsGroupedByDay"
        :selectedEventId="selectedEventId"
        @go-to-settings="goToSettings"
        @go-to-dashboard="goToDashboard"
        @show-create-event="showCreateEventPopup = true"
        @select-event="selectEvent"
      />

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
import EventInfo from '../components/events/EventInfo.vue';
import ItineraryInfo from '../components/itinerary/ItineraryInfo.vue';
import CreateEventPopup from '../components/popups/CreateEventPopup.vue';
import CreateNotePopup from '../components/popups/CreateNotePopup.vue';
import CreateTodoPopup from '../components/popups/CreateTodoPopup.vue';
import CreateBudgetPopup from '../components/popups/CreateBudgetPopup.vue';

export default {
  name: 'ItineraryPage',
  components: {
    EventInfo,
    ItineraryInfo,
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

      // First sort events within each day by time_start
      Object.values(grouped).forEach(dayEvents => {
        dayEvents.sort((a, b) => {
          if (!a.time_start) return 1;  // Push events without time to the end
          if (!b.time_start) return -1;
          return a.time_start.localeCompare(b.time_start);
        });
      });

      // Then sort days numerically
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
