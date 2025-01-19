<template>
  <div class="itinerary-container flex flex-col min-h-screen min-w-screen pt-20 bg-gray-500">
    <LoadingScreen />
    <template v-if="isPrivate">
      <div class="flex flex-col items-center justify-center p-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Private Itinerary</h2>
        <p class="text-gray-600">This itinerary is private or does not exist.</p>
      </div>
    </template>
    <template v-else>
      <div :class="isDesktop ? 'flex space-x-4 pt-10' : 'flex flex-col'" class="justify-center w-full">
        <ItineraryHeadline
          :itineraryId="itineraryId"
          :image="itineraryImgUrl"
          :title="itineraryName"
          :description="itineraryDescription"
          :numberOfDays="eventsGroupedByDay"
          :createdBy="createdBy"
          class="w-3/10"
        />

        <ItineraryInfo
          :itineraryId="itineraryId"
          :itineraryImgUrl="itineraryImgUrl"
          :itineraryName="itineraryName"
          :itineraryDescription="itineraryDescription"
          :eventsGroupedByDay="eventsGroupedByDay"
          :selectedEventId="selectedEventId"
          :isOwner="isOwner"
          @go-to-settings="goToSettings"
          @go-to-dashboard="goToDashboard"
          @select-event="selectEvent"
          @edit-event="editEvent"
          @delete-event="deleteEvent"
          @show-create-event="showCreateEventPopup = true"
          @show-report-event="showReportEventPopup = true"
          @refresh="loadEvents"
          class="w-full"
        />
      </div>

      <!-- Create Event Popup -->
      <CreateEventPopup
        v-if="showCreateEventPopup"
        :itineraryId="itineraryId"
        :itineraryData="itineraryData"
        @close="closeCreateEventPopup"
        @refresh="loadEvents"
      />

      <!-- Report Event Popup -->
      <ReportEventPopup
        v-if="showReportEventPopup"
        :itineraryId="itineraryId"
        @close="closeReportEventPopup"
        @refresh="loadEvents"
      />

      <!-- Create Notes Popup -->
      <CreateNotePopup
        @refresh="loadEvents"
      />

      <!-- Create Todo Popup -->
      <CreateTodoPopup
        @refresh="loadEvents"
      />

      <!-- Create Budget Popup -->
      <CreateBudgetPopup
        @refresh="loadEvents"
      />

      <!-- Event Info Popup -->
      <EventInfoPopup
        v-if="!isDesktop"
        :eventId="selectedEventId"
        :isOwner="isOwner"
        @close="showEventInfoPopup = false"
      />
    </template>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUser, setLoading, setEventId } from '../context/UserContext';
import { supabase } from '../helpers/supabaseClient';
import { fetchItinerary } from '../helpers/itinerary';
import { fetchItineraryEvents } from '../helpers/event';
import ItineraryInfo from '../components/itinerary/ItineraryInfo.vue';
import CreateEventPopup from '../components/popups/CreateEventPopup.vue';
import ReportEventPopup from '../components/popups/ReportEventPopup.vue';
import CreateNotePopup from '../components/popups/CreateNotePopup.vue';
import CreateTodoPopup from '../components/popups/CreateTodoPopup.vue';
import CreateBudgetPopup from '../components/popups/CreateBudgetPopup.vue';
import LoadingScreen from '../components/common/LoadingScreen.vue';
import ItineraryHeadline from '../components/itinerary/ItineraryHeadline.vue';
import EventInfoPopup from '@/components/events/EventInfoPopup.vue';

export default {
  name: 'ItineraryPage',
  components: {
    ItineraryInfo,
    CreateEventPopup,
    ReportEventPopup,
    CreateNotePopup,
    CreateTodoPopup,
    CreateBudgetPopup,
    LoadingScreen,
    ItineraryHeadline,
    EventInfoPopup
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const user = useUser();
    const itineraryId = route.params.id;
    const itineraryName = ref('');
    const itineraryDescription = ref('');
    const itineraryImgUrl = ref('');
    const itineraryData = ref(null);
    const events = ref([]);
    const selectedEventId = ref(null);
    const showCreateEventPopup = ref(false);
    const showReportEventPopup = ref(false);
    const showCreateNotePopup = ref(false);
    const showCreateTodoPopup = ref(false);
    const showCreateBudgetPopup = ref(false);
    const showSettingsPopup = ref(false);
    const isOwner = ref(false);
    const isPrivate = ref(false);
    const createdBy = ref('');
    const isDesktop = ref(window.innerWidth >= 640);

    // Check authentication and get current user
    const checkAuth = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      console.log('Current auth user:', authUser);
      console.log('Current user context:', user);
      
      if (authUser && authUser.id !== user.user_id) {
        console.log('User context needs update. Auth user ID:', authUser.id);
        // Update user context if needed
        const { data: profile } = await supabase
          .from('profile')
          .select('username')
          .eq('user_id', authUser.id)
          .single();
        
        if (profile) {
          console.log('Updating user context with profile:', profile);
          user.setUser({
            username: profile.username,
            email: authUser.email,
            user_id: authUser.id,
          });
        }
      }
      return authUser?.id;
    };

    // Fetch itinerary details and events
    const loadItinerary = async () => {
      const currentUserId = await checkAuth();
      console.log('Loading itinerary with user ID:', currentUserId);
      const response = await fetchItinerary(itineraryId, currentUserId);
      console.log('Fetch itinerary response:', response);
      
      if (response.error) {
        console.log('Error response:', response.error);
        if (response.isPrivate) {
          console.log('Itinerary is private - blocking access');
          isPrivate.value = true;
          // Clear any existing data
          itineraryName.value = '';
          itineraryDescription.value = '';
          itineraryImgUrl.value = '';
          isOwner.value = false;
          events.value = [];
          return;
        }
        console.error('Error fetching itinerary:', response.error);
        return;
      }

      const { data } = response;
      console.log('Itinerary loaded:', data);
      console.log('Is owner:', data.isOwner);
      
      itineraryData.value = data;
      itineraryName.value = data.name;
      itineraryDescription.value = data.description;
      itineraryImgUrl.value = data.img_url;
      isOwner.value = data.isOwner;
      createdBy.value = data.created_by;
    };

    const loadEvents = async () => {
      // Don't load events if itinerary is private
      if (isPrivate.value) {
        console.log('Not loading events - itinerary is private');
        return;
      }

      console.log ('refreshing...');
      
      const { data, error } = await fetchItineraryEvents(itineraryId);
      if (!error) {
        events.value = data;
      } else {
        console.error('Error fetching events:', error.message);
      }
    };

    const checkWindowSize = () => {
      isDesktop.value = window.innerWidth >= 640;
    };

    onMounted(() => {
      setLoading(true); // Show loading on start
      loadItinerary().then(() => {
        // Only load events if itinerary is not private
        if (!isPrivate.value) {
          loadEvents().finally(() => {
            setLoading(false); // Hide loading after everything is loaded
          });
        } else {
          setLoading(false); // Hide loading if itinerary is private (no events to load)
        }
      }).catch(() => {
        setLoading(false); // Hide loading if there's an error
      });
      window.addEventListener('resize', checkWindowSize);
    });
    onUnmounted(() => {
      window.removeEventListener('resize', checkWindowSize);
    });

    const selectEvent = (id) => {
      selectedEventId.value = id;
      setEventId(id);
    };

    const closeCreateEventPopup = () => {
      showCreateEventPopup.value = false;
    };

    const closeReportEventPopup = () => {
      showReportEventPopup.value = false;
    };

    const goToDashboard = () => {
      router.push('/dashboard');
    };

    const goToSettings = () => {
      showSettingsPopup.value = false;
      router.push(`/itinerary/${route.params.id}/settings`);
    };

    const editEvent = (eventId) => {
      console.log('Edit event:', eventId);
    };

    const deleteEvent = (eventId) => {
      console.log('Delete event:', eventId);
    };

    const eventsGroupedByDay = computed(() => {
      const grouped = events.value.reduce((acc, event) => {
        const dayKey = event.day;
        if (!acc[dayKey]) acc[dayKey] = [];
        acc[dayKey].push(event);
        return acc;
      }, {});

      console.log('Events grouped by day:', grouped);

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
      itineraryData,
      eventsGroupedByDay,
      selectedEventId,
      showCreateEventPopup,
      showReportEventPopup,
      showCreateNotePopup,
      showCreateTodoPopup,
      showCreateBudgetPopup,
      showSettingsPopup,
      loadEvents,
      closeCreateEventPopup,
      closeReportEventPopup,
      selectEvent,
      selectedEvent,
      goToDashboard,
      goToSettings,
      isOwner,
      isPrivate,
      editEvent,
      deleteEvent,
      createdBy,
      isDesktop
    };
  },
  methods: {
    handleEventUpdate() {
      console.log('Event updated');
      this.loadEvents();
    }
  }
};
</script>

<style scoped>
.itinerary-container {
  display: flex;
  min-height: 100vh;
}
.overflow-y-auto {
  max-height: calc(100vh - 16rem); /* Adjust to ensure scrolling within the center */
}
.tabs {
  font-size: 1rem;
}

@media (max-width: 640px) {
  .tabs {
    font-size: 0.875rem;
  }
}
</style>
