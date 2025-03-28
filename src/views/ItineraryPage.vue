<template>
  <div class="itinerary-container flex flex-col min-h-screen min-w-screen pt-20 bg-gray-500">
    <LoadingScreen />
    <template v-if="itineraryFetchError">
      <div class="flex flex-col items-center justify-center p-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ itineraryFetchError.title }}</h2>
        <p class="text-gray-600">{{ itineraryFetchError.message }}</p>
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
          @show-create-event="showCreateEventPopup = true"
          @show-report-event="showReportEventPopup = true"
          @show-edit-itinerary="showEditItineraryPopup = true"
          @show-share="showSharePopup = true"
          @refresh="loadEvents"
          class="w-full"
        />
      </div>
    </template>

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

    <!-- Edit Itinerary Popup -->
    <EditItineraryPopup
      v-if="showEditItineraryPopup"
      :itineraryId="itineraryId"
      @close="showEditItineraryPopup = false"
      @refresh="refreshPage"
    />

    <!-- Share Itinerary Popup -->
    <SharePopup
      v-if="showSharePopup"
      :itineraryId="itineraryId"
      @close="showSharePopup = false"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUser, setEventId, refreshItinerary } from '../context/UserContext';
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
import EditItineraryPopup from '@/components/popups/EditItineraryPopup.vue';
import SharePopup from '@/components/popups/SharePopup.vue';

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
    EventInfoPopup,
    EditItineraryPopup,
    SharePopup
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
    const showEditItineraryPopup = ref(false);
    const showSharePopup = ref(false);
    const isOwner = ref(false);
    const itineraryFetchError = ref(null);
    const createdBy = ref('');
    const isDesktop = ref(window.innerWidth >= 640);

    // Check authentication and get current user
    const checkAuth = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser && authUser.id !== user.user_id) {
        // Update user context if needed
        const { data: profile } = await supabase
          .from('profile')
          .select('username')
          .eq('user_id', authUser.id)
          .single();
        
        if (profile) {
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
      const response = await fetchItinerary(itineraryId, currentUserId);
      
      if (response.status === 404) {
        itineraryFetchError.value = {
          title: 'Itinerary Not Found',
          message: 'The itinerary you are looking for does not exist or has been removed.',
        };
        return;
      }
      if (response.error) {
        if (response.isPrivate) {
          itineraryFetchError.value = {
            title: 'Private Itinerary',
            message: 'This itinerary is private or does not exist.',
          };

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
      
      itineraryData.value = data;
      itineraryName.value = data.name;
      itineraryDescription.value = data.description;
      itineraryImgUrl.value = data.img_url;
      isOwner.value = data.isOwner;
      createdBy.value = data.created_by;
    };

    const loadEvents = async () => {
      // Don't load events if itinerary is private
      if (itineraryFetchError.value) { 
        return;
      }
      
      const { data, error } = await fetchItineraryEvents(itineraryId);
      if (!error) {
        events.value = data;
      } else {
        console.error('Error fetching events:', error.message);
      }

      refreshItinerary();
      refreshEventsGroupedByDay();
    };

    const checkWindowSize = () => {
      isDesktop.value = window.innerWidth >= 640;
    };

    onMounted(() => {
      //setLoading(true); // Show loading on start
      loadItinerary().then(() => {
        // Only load events if itinerary is not private
        if (!itineraryFetchError.value) {
          loadEvents().finally(() => {
            //setLoading(false); // Hide loading after everything is loaded
          });
        } else {
          //setLoading(false); // Hide loading if itinerary is private (no events to load)
        }
      }).catch(() => {
        //setLoading(false); // Hide loading if there's an error
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
      if (document.referrer && (document.referrer.includes('localhost') || document.referrer.includes('goagenda'))) {
        router.back();
      } else {
        router.push('/dashboard');
      }
    };

    const goToSettings = () => {
      showSettingsPopup.value = false;
      router.push(`/itinerary/${route.params.id}/settings`);
    };

    const goToEditItinerary = () => {
      showEditItineraryPopup.value = false;
      router.push(`/itinerary/${route.params.id}/settings`);
    };

    const eventsGroupedByDay = computed(() => {
      return refreshEventsGroupedByDay();
    });

    const refreshEventsGroupedByDay = () => {
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
    };

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
      createdBy,
      isDesktop,
      refreshEventsGroupedByDay,
      itineraryFetchError,
      goToEditItinerary,
      showEditItineraryPopup,
      showSharePopup
    };
  },
  methods: {
    handleEventUpdate() {
      this.loadEvents();
    },
    refreshPage() {
      window.location.reload();
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
