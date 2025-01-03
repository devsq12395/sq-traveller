<template>
  <div v-if="isDesktop" class="bg-blue-100 p-4 rounded-lg shadow-lg w-full mt-4">
    <div class="grid grid-cols-3 gap-4 items-stretch h-48">
      <!-- Column #1: Main Texts -->
      <div class="col-span-2 bg-blue-200 p-3 rounded-lg shadow-inner">
        <div class="text-left">
          <h2 class="text-2xl font-bold text-gray-800">{{ name }}</h2>
          <p class="text-gray-600">
            Day {{ day || 'not assigned' }}<br>
            Time: {{ formatTime(time_start) || 'N/A' }} - {{ formatTime(time_end) || 'N/A' }}
          </p>
          <!-- Divider -->
          <hr class="border-black my-1" />
          <!-- Location Section -->
          <div class="text-left">
            <h3 class="text-base font-semibold text-gray-800">Location:</h3>
            <p class="text-gray-700 truncate">{{ location }}</p>
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
    
    <div v-if="isOwner" class="flex space-x-4 mt-4">
      <button 
        @click="showEditEventPopup = true" 
        class="p-2 px-4 bg-green-500 text-white rounded shadow"
        style="margin-right: 16px;"
      >
        Edit Details
      </button>
      <button 
        @click="confirmDelete" 
        class="p-2 px-4 bg-red-500 text-white rounded shadow"
      >
        Delete Event
      </button>
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
      @eventUpdated="$emit('eventUpdated')"
    />

    <!-- Arrow Button -->
    <div class="arrow-container bg-blue-400 flex justify-center">
      <button @click="toggleInfo" class="arrow-button text-blue-500 hover:text-blue-700 w-full">
        <span v-if="!isExpanded">▼</span>
        <span v-else>▲</span>
      </button>
    </div>
  </div>
  <div v-else class="bg-blue-100 p-4 rounded-lg shadow-lg w-full mt-4">
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
          <!-- Divider -->
          <hr class="border-black my-1" />
          <!-- Location Section -->
          <div class="text-left">
            <h3 class="text-sm font-semibold text-gray-800">Location:</h3>
            <p class="text-sm text-gray-700 truncate">{{ location }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-col mt-4">
      <button 
        @click="showEventInfoPopup(eventId)" 
        class="p-3 px-6 bg-orange-400 text-white rounded shadow text-sm"
      >
        View Event Details
      </button>

      <div v-if="isOwner" class="flex space-x-4 mt-4">
        <button 
          @click="showEditEventPopup = true" 
          class="p-2 px-4 bg-green-500 text-white rounded shadow text-xs"
          style="margin-right: 16px;"
        >
          Edit Details
        </button>
        <button 
          @click="confirmDelete" 
          class="p-2 px-4 bg-red-500 text-white rounded shadow text-xs"
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
      @eventUpdated="$emit('eventUpdated')"
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
  emits: ['select-event', 'refresh', 'eventUpdated'],
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

.arrow-container {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.arrow-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}
</style>
