<template>
  <div v-if="isDesktop" class="bg-blue-100 p-4 rounded-lg shadow-lg w-full mt-4">
    <div class="grid grid-cols-3 gap-4 items-stretch h-48">
      <!-- Column #1: Main Texts -->
      <div class="col-span-2 bg-blue-200 p-4 rounded-lg shadow-inner w-full">
        <div class="grid grid-cols-12 gap-4 items-start">
          <!-- Left Column: Main Text  -->
          <div class="col-span-7 flex flex-col justify-start">
            <h2 class="text-2xl font-bold text-gray-800 text-left">{{ name }}</h2>
            <p class="text-gray-600 text-left mt-2">{{ short_description }}</p>
          </div>

          <!-- Divider Line -->
          <div class="col-span-1 flex items-center justify-center">
            <div class="w-1 bg-gray-500 h-full"></div>
          </div>

          <!-- Right Column: Details -->
          <div class="col-span-4 text-right text-sm">
            <p class="text-gray-600">Day {{ day || 'not assigned' }}</p>
            <p class="text-gray-600">
              Time: {{ formatTime(time_start) || 'N/A' }} - {{ formatTime(time_end) || 'N/A' }}
            </p>
            <br>
            <p class="text-gray-700 overflow-hidden" style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;">
              <strong>Location:</strong> {{ location.length > 4 * 20 ? location.substring(0, 4 * 20) + '...' : location }}
            </p>
          </div>
        </div>
      </div>

      <!-- Column #2: Image -->
      <div class="col-span-1 h-full rounded-lg overflow-hidden bg-gray-200">
        <img 
          :src="imgUrl" 
          alt="Event Thumbnail" 
          class="w-full h-full object-cover"
        />
      </div>
    </div>

    <!-- Sprouting Section -->
    <div class="event-info" ref="infoSprouting">
      <EventInfoSprouting 
        class="transition-all duration-300 w-full" 
        :event="{ eventId, name, location, day, description, imgUrl, time_start, time_end }" 
        :isOwner="isOwner"
      />
    </div>
    
    <!-- Event Buttons -->
    <div class="flex justify-between items-center mt-3">
      <!-- Arrow Button -->
      <button @click="toggleInfo" class="text-gray-600 hover:text-gray-500 underline cursor-pointer bg-blue-200 p-1 rounded">
        <span v-if="!isExpanded">▼ More Details</span>
        <span v-else>▲ More Details</span>
      </button>

      <div v-if="isOwner" class="flex space-x-4">
        <button 
          @click="showEditEventPopup = true" 
          class="px-2 bg-blue-500 text-white rounded shadow"
        >
          Edit Details
        </button>
        <button 
          @click="confirmDelete" 
          class="px-2 py-1 bg-red-500 text-white rounded shadow"
        >
          Delete Event
        </button>
      </div>
    </div>

    <!-- EditEventPopup -->
    <EditEventPopup 
      v-if="showEditEventPopup" 
      :eventId="eventId" 
      @close="showEditEventPopup = false"
      @refresh="$emit('refresh')" 
    />

    <!-- Delete Event Popup -->
    <div v-if="showDeleteConfirm" class="mt-4">
      <p>Are you sure you want to delete this event?</p>
      <button 
        @click="handleDelete" 
        class="p-2 px-4 bg-red-500 text-white rounded shadow"
      >
        Yes, delete event
      </button>
      <button 
        @click="showDeleteConfirm = false" 
        class="p-2 px-4 bg-gray-500 text-white rounded shadow"
      >
        Cancel
      </button>
    </div>
  </div>
  <div v-else class="bg-blue-100 py-4 px-2 rounded-lg shadow-lg w-full mt-4">
    <div class="grid grid-cols-1 gap-4 items-stretch">
      <!-- Image on Top -->
      <div class="h-48 rounded-lg overflow-hidden bg-gray-200">
        <img 
          :src="imgUrl" 
          alt="Event Thumbnail" 
          class="w-full h-full object-cover"
        />
      </div>
      <!-- Main Texts -->
      <div class="bg-blue-200 p-3 rounded-lg shadow-inner">
        <div class="text-left">
          <h2 class="text-xl font-bold text-gray-800">{{ name }}</h2>
          <p class="text-sm text-gray-600">
            Day {{ day || 'not assigned' }}<br>
            Time: {{ formatTime(time_start) || 'N/A' }} - {{ formatTime(time_end) || 'N/A' }}
          </p>
          <!-- Location Section -->
          <div class="text-left">
            <h3 class="text-sm font-semibold text-gray-800">Location:</h3>
            <p class="text-sm text-gray-700 truncate">{{ location }}</p>
          </div>
          
          <!-- Divider -->
          <hr class="border-black mt-2 mb-3" />

          <!-- Short Description -->
          <div class="text-left">
            <p class="text-m text-gray-700">{{ short_description }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-col mt-4">
      <button 
        @click="showEventInfoPopup(eventId)" 
        class="px-6 py-2 bg-orange-400 text-white rounded shadow text-sm"
      >
        View Event Details
      </button>

      <div v-if="isOwner" class="flex justify-center space-x-4 mt-4">
        <button 
          @click="showEditEventPopup = true" 
          class="px-4 py-1 bg-green-500 text-white rounded shadow text-sm"
        >
          Edit Details
        </button>
        <button 
          @click="confirmDelete" 
          class="px-4 py-1 bg-red-500 text-white rounded shadow text-sm"
        >
          Delete Event
        </button>
      </div>
    </div>

    <div v-if="showDeleteConfirm" class="mt-4">
      <p>Are you sure you want to delete this event?</p>
      <button 
        @click="handleDelete" 
        class="p-2 px-4 bg-red-500 text-white rounded shadow"
      >
        Yes, delete event
      </button>
      <button 
        @click="showDeleteConfirm = false" 
        class="p-2 px-4 bg-gray-500 text-white rounded shadow"
      >
        Cancel
      </button>
    </div>

    <!-- EditEventPopup -->
    <EditEventPopup 
      v-if="showEditEventPopup" 
      :eventId="eventId" 
      @close="showEditEventPopup = false"
      @refresh="$emit('refresh')"
    />
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import EventInfoSprouting from './EventInfoSprouting.vue';
import { deleteEvent } from '../../helpers/event';
import EditEventPopup from '../popups/EditEventPopup.vue';
import { setEventInfoPopupShow } from '../../context/UserContext';

export default {
  name: 'EventEntry',
  components: {
    EventInfoSprouting,
    EditEventPopup
  },
  props: {
    eventId: { type: String, required: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    day: { type: String, required: true, default: 'No day assigned' },
    short_description: { type: String, required: true },
    description: { type: String, required: true },
    imgUrl: { type: String, required: true },
    time_start: { type: String, required: true },
    time_end: { type: String, required: true },
    isOwner: { type: Boolean, default: false }
  },
  setup(props, {emit}) {
    const infoSprouting = ref(null);
    const isExpanded = ref(false);
    const showEditEventPopup = ref(false);
    const showDeleteConfirm = ref(false);

    const isDesktop = ref(window.innerWidth >= 640);

    const checkWindowSize = () => {
      isDesktop.value = window.innerWidth >= 640;
    };

    const toggleInfo = () => {
      if (!infoSprouting.value) return;

      isExpanded.value = !isExpanded.value;
      const targetHeight = isExpanded.value ? 'auto' : '0px';
      gsap.to(infoSprouting.value, {
        height: targetHeight,
        duration: 0.5,
        ease: 'power2.inOut'
      });
    };

    const confirmDelete = () => {
      showDeleteConfirm.value = true;
    };

    const handleDelete = async () => {
      const { error } = await deleteEvent(event.eventId);
      if (error) {
        console.error('Error deleting event:', error);
      } else {
        showDeleteConfirm.value = false;
        emit('refresh');
      }
    };

    const showEventInfoPopup = (eventId) => {
      setEventInfoPopupShow(eventId, true);
      emit('select-event', eventId);
    };

    onMounted(() => {
      if (!infoSprouting.value) return;
      infoSprouting.value.style.height = '0px';
      window.addEventListener('resize', checkWindowSize);
      checkWindowSize();
    });

    onUnmounted(() => {
      window.removeEventListener('resize', checkWindowSize);
    });

    return {
      infoSprouting,
      isExpanded,
      toggleInfo,
      showEditEventPopup,
      showDeleteConfirm,
      confirmDelete,
      handleDelete,
      isDesktop,
      showEventInfoPopup
    };
  },
  emits: ['select-event', 'refresh'],
  methods: {
    formatTime(time) {
      if (!time) return 'N/A';
      const [hour, minute] = time.split(':');
      return `${hour}:${minute}`;
    }
  }
};
</script>

<style scoped>
.event-info {
  overflow: hidden;
  height: 0;
}
</style>
