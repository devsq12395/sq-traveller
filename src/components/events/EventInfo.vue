<template>
  <div v-if="event" class="bg-purple-100 p-6 rounded shadow-lg grid grid-cols-3 gap-4 w-full">
    <!-- Column #1: Image -->
    <div class="col-span-1">
      <img 
        :src="event.img_url" 
        alt="Event Thumbnail" 
        class="w-full max-h-64 object-cover rounded shadow-md"
      />
    </div>

    <!-- Column #2: Name and Details -->
    <div class="col-span-2 space-y-4">
      <!-- Event Name -->
      <h2 class="text-3xl font-bold">{{ event.name }}</h2>
      <p class="text-gray-600">
        Day {{ event.day || 'not assigned' }}
        <br>
        Time: {{ formatTime(event.time_start) || 'N/A' }} - {{ formatTime(event.time_end) || 'N/A' }}
      </p>

      <!-- Location Section -->
      <div class="text-left">
        <h3 class="text-lg font-semibold">Location:</h3>
        <p class="text-gray-700 text-left">{{ event.location }}</p>
      </div>

      <!-- Description Section -->
      <div class="text-left">
        <h3 class="text-lg font-semibold">Description:</h3>
        <p class="text-gray-700 text-left">{{ event.description }}</p>
      </div>

      <!-- Notes Section -->
      <div class="text-left">
        <h3 class="text-lg font-semibold">Notes:</h3>
        <div v-if="notes.length > 0">
          <ul class="text-left">
            <li v-for="note in notes" :key="note.id" class="text-gray-700">- {{ note.note }}</li>
          </ul>
        </div>
        <p v-else class="text-gray-700 text-left">No notes available</p>
      </div>

      <!-- Divider -->
      <hr class="border-gray-400 my-4" />

      <!-- Edit Buttons Section -->
      <div v-if="isOwner" class="flex space-x-4">
        <button 
          @click="showEditEventPopup = true" 
          class="p-2 px-4 bg-green-500 text-white rounded shadow"
        >
          Edit Details
        </button>
        <button 
          @click="$emit('show-add-note')" 
          class="p-2 px-4 bg-green-500 text-white rounded shadow"
        >
          Add a note
        </button>
        <button 
          @click="confirmDelete" 
          class="p-2 px-4 bg-red-500 text-white rounded shadow hover:bg-red-600"
        >
          Delete Event
        </button>
      </div>
    </div>

    <!-- Column #3: Things to Do and Budget -->
    <div class="col-span-3 mt-6 grid grid-cols-2 gap-4">
      <div class="space-y-4">
        <EventActivities 
          :eventId="event.id" 
          :isOwner="isOwner"
          :key="event.id" 
          @show-add-todo="$emit('show-add-todo')" 
        />
      </div>
      <div class="space-y-4">
        <EventBudgets 
          :eventId="event.id" 
          :isOwner="isOwner"
          :key="event.id" 
          @show-add-budget="$emit('show-add-budget')" 
        />
      </div>
    </div>

    <!-- EditEventPopup -->
    <EditEventPopup 
      v-if="showEditEventPopup" 
      :eventId="event.id" 
      @close="showEditEventPopup = false"
      @refresh="$emit('refresh')" 
      @eventUpdated="$emit('eventUpdated')"
    />

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h3 class="text-xl font-bold mb-4">Delete Event</h3>
        <p class="text-gray-700 mb-6">Are you sure you want to delete this event? This action cannot be undone.</p>
        <div class="flex justify-end space-x-4">
          <button
            @click="showDeleteConfirm = false"
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            @click="handleDelete"
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchEventNotes } from '../../helpers/notes';
import { deleteEvent } from '../../helpers/event';
import EditEventPopup from '../popups/EditEventPopup.vue';
import EventActivities from './EventActivities.vue';
import EventBudgets from './EventBudgets.vue';

export default {
  name: 'EventInfo',
  emits: ['show-add-note', 'show-add-todo', 'show-add-budget', 'refresh'],
  props: {
    event: {
      type: Object,
      required: true
    },
    isOwner: {
      type: Boolean,
      default: false
    }
  },
  components: {
    EventActivities,
    EventBudgets,
    EditEventPopup
  },
  data() {
    return {
      showEditEventPopup: false,
      showDeleteConfirm: false,
      notes: []
    };
  },
  watch: {
    event: {
      handler(newEvent) {
        if (newEvent) {
          this.fetchNotes(newEvent.id);
        }
      },
      immediate: true
    }
  },
  methods: {
    formatTime(time) {
      if (!time) return '';
      return time.substring(0, 5); // Takes only HH:mm part
    },
    async fetchNotes(eventId) {
      const { data } = await fetchEventNotes(eventId);
      if (data) {
        this.notes = data;
      }
    },
    confirmDelete() {
      this.showDeleteConfirm = true;
    },
    async handleDelete() {
      const { error } = await deleteEvent(this.event.id);
      if (error) {
        console.error('Error deleting event:', error);
      } else {
        this.showDeleteConfirm = false;
        this.$emit('refresh');
      }
    }
  }
};
</script>

<style scoped>
/* Ensure the image has a size limit */
img {
  max-height: 256px; /* Restricts image height */
  object-fit: cover;
}
</style>
