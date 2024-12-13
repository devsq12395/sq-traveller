<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded shadow-lg w-4/5 max-w-5xl">
      <div class="grid grid-cols-3 gap-4">
        <!-- Column #1: Image -->
        <div class="col-span-1">
          <img 
            :src="event.img_url" 
            alt="Event Thumbnail" 
            class="w-full max-h-64 object-cover rounded shadow-md"
          />
        </div>

        <!-- Column #2: Main Texts with Box Background -->
        <div class="col-span-2 bg-gray-100 p-4 rounded-lg shadow-inner">
          <h2 class="text-3xl font-bold">{{ event.name }}</h2>
          <p class="text-gray-600">
            Day {{ event.day || 'not assigned' }}
            <br>
            Time: {{ formatTime(event.time_start) || 'N/A' }} - {{ formatTime(event.time_end) || 'N/A' }}
          </p>

          <!-- Location Section -->
          <div class="text-left">
            <h3 class="text-lg font-semibold">Location:</h3>
            <p class="text-gray-700">{{ event.location }}</p>
          </div>

          <!-- Description Section -->
          <div class="text-left">
            <h3 class="text-lg font-semibold">Description:</h3>
            <p class="text-gray-700">{{ event.description }}</p>
          </div>

          <!-- Notes Section with "Add Note" Button -->
          <div class="text-left">
            <h3 class="text-lg font-semibold">Notes:</h3>
            <div class="flex justify-between items-start">
              <div>
                <ul v-if="notes.length > 0" class="text-gray-700">
                  <li v-for="note in notes" :key="note.id">- {{ note.note }}</li>
                </ul>
                <p v-else class="text-gray-700">No notes available</p>
              </div>
              <button 
                @click="$emit('show-add-note')" 
                class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >Add a note</button>
            </div>
          </div>

          <!-- Divider -->
          <hr class="border-gray-400 my-4" />

          <!-- Edit Buttons Section -->
          <div v-if="isOwner" class="flex space-x-4">
            <button 
              @click="showEditEventPopup = true" 
              class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >Edit Event</button>
            <button 
              @click="confirmDelete" 
              class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >Delete Event</button>
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

      <!-- Bottom Close Button -->
      <div class="flex justify-center mt-4">
        <button @click="$emit('close')" class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchEventNotes } from '../../helpers/notes';
import { deleteEvent } from '../../helpers/event';
import EditEventPopup from '../popups/EditEventPopup.vue';
import EventActivities from '../events/EventActivities.vue';
import EventBudgets from '../events/EventBudgets.vue';

export default {
  name: 'EventInfoPopup',
  emits: ['show-add-note', 'show-add-todo', 'show-add-budget', 'refresh', 'close'],
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
      if (!time) return 'N/A';
      const [hour, minute] = time.split(':');
      const period = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minute} ${period}`;
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
.fixed {
  position: fixed;
}
img {
  max-height: 256px;
  object-fit: cover;
}
</style>
