<template>
  <div v-if="event" class="bg-purple-100 p-6 rounded shadow-lg flex space-x-8 w-full">
    <!-- Column #1: Image, Name, Time, Description, Notes -->
    <div class="flex-1 space-y-4">
      <!-- Event Image and Name -->
      <div class="mb-4">
        <img :src="event.img_url" alt="Event Thumbnail" class="w-full object-cover rounded shadow-md mb-2" />
        <h2 class="text-3xl font-bold">{{ event.location }}</h2>
        <p class="text-gray-600">
          Day {{ event.day || 'not assigned' }}
        </p>
      </div>

      <!-- Description Section -->
      <div class="text-left">
        <h3 class="text-lg font-semibold">Description:</h3>
        <p class="text-gray-700">{{ event.description }}</p>
      </div>

      <!-- Notes Section -->
      <div class="text-left">
        <h3 class="text-lg font-semibold">Notes:</h3>
        <div v-if="notes.length > 0">
          <ul>
            <li v-for="note in notes" :key="note.id" class="text-gray-700">- {{ note.note }}</li>
          </ul>
        </div>
        <p v-else class="text-gray-700">No notes available</p>
      </div>

      <!-- Edit Buttons Section -->
      <div class="flex space-x-4">
        <button @click="showEditEventPopup = true" class="p-2 px-4 bg-green-500 text-white rounded shadow">Edit Details</button>
        <button @click="$emit('show-add-note')" class="p-2 px-4 bg-green-500 text-white rounded shadow">Add a note</button>
      </div>
    </div>

    <!-- Column #2: Things to Do -->
    <div class="w-1/4 space-y-4">
      <EventActivities :eventId="event.id" />
    </div>

    <!-- Column #3: Budget -->
    <div class="w-1/4 space-y-4">
      <EventBudgets :eventId="event.id" />
    </div>

    <!-- EditEventPopup -->
    <EditEventPopup v-if="showEditEventPopup" :event="event" @close="showEditEventPopup = false" />
  </div>
</template>

<script>
import EventActivities from './EventActivities.vue';
import EventBudgets from './EventBudgets.vue';
import EditEventPopup from '../popups/EditEventPopup.vue';
import { fetchEventNotes } from '../../helpers/notes'; // Import the fetchEventNotes function

export default {
  name: 'EventInfo',
  props: {
    event: {
      type: Object,
      required: true,
    },
  },
  components: {
    EventActivities,
    EventBudgets,
    EditEventPopup,
  },
  data() {
    return {
      showEditEventPopup: false,
      notes: [], // Reactive data property to store notes
    };
  },
  watch: {
    event: {
      immediate: true, // Trigger the watcher immediately on component mount
      handler(newEvent) {
        if (newEvent && newEvent.id) {
          this.fetchNotes(newEvent.id);
        }
      },
    },
  },
  methods: {
    async fetchNotes(eventId) {
      const { data, error } = await fetchEventNotes(eventId);
      if (!error) {
        this.notes = data;
      } else {
        console.error('Error fetching notes:', error);
      }
    },
  },
};
</script>

<style scoped>
/* Add custom styling if necessary */
</style>
