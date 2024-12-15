<template>
  <div class="flex flex-col min-h-screen pt-20 bg-gray-500">
    <LoadingScreen />
    <template v-if="isPrivate">
      <div class="flex flex-col items-center justify-center p-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">Private Itinerary</h2>
        <p class="text-gray-600">This itinerary is private. Only the owner can view it.</p>
      </div>
    </template>
    <template v-else>
      <div class="flex flex-col items-center p-8">
        <ItineraryHeadline
          :itineraryId="itineraryId"
          :image="itineraryImgUrl"
          :title="itineraryName"
          :description="itineraryDescription"
          :numberOfDays="eventsGroupedByDay"
          :createdBy="createdBy"
        />

        <div class="flex justify-center w-full">
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
            @show-add-note="showCreateNotePopup = true"
            @show-add-todo="showCreateTodoPopup = true"
            @show-add-budget="showCreateBudgetPopup = true"
            class="w-7/10"
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
    </template>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUser, setLoading, setEventId } from '../context/UserContext';
import { supabase } from '../helpers/supabaseClient';
import { fetchItinerary } from '../helpers/itinerary';
import { fetchItineraryEvents } from '../helpers/event';
import ItineraryInfo from '../components/itinerary/ItineraryInfo.vue';
import CreateEventPopup from '../components/popups/CreateEventPopup.vue';
import CreateNotePopup from '../components/popups/CreateNotePopup.vue';
import CreateTodoPopup from '../components/popups/CreateTodoPopup.vue';
import CreateBudgetPopup from '../components/popups/CreateBudgetPopup.vue';
import LoadingScreen from '../components/common/LoadingScreen.vue';
import ItineraryHeadline from '../components/itinerary/ItineraryHeadline.vue';

export default {
  name: 'ItineraryPage',
  components: {
    ItineraryInfo,
    CreateEventPopup,
    CreateNotePopup,
    CreateTodoPopup,
    CreateBudgetPopup,
    LoadingScreen,
    ItineraryHeadline,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const user = useUser();
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
    const isOwner = ref(false);
    const isPrivate = ref(false);
    const createdBy = ref('');

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
      
      const { data, error } = await fetchItineraryEvents(itineraryId);
      if (!error) {
        events.value = data;
      } else {
        console.error('Error fetching events:', error.message);
      }
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
    });

    const selectEvent = (id) => {
      selectedEventId.value = id;
      setEventId(id);
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
      isOwner,
      isPrivate,
      editEvent,
      deleteEvent,
      createdBy,
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
/* Additional styles for fixed sections and scrollable content */
.overflow-y-auto {
  max-height: calc(100vh - 16rem); /* Adjust to ensure scrolling within the center */
}
</style>
