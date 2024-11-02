<template>
  <div v-if="event" class="bg-purple-100 p-6 rounded shadow-lg flex space-x-8 w-full">
    <!-- Column #1: Image, Name, Time, Description, Notes -->
    <div class="flex-1 space-y-4">
      <!-- Event Image and Name -->
      <div class="mb-4">
        <img src="https://via.placeholder.com/300x150" alt="Event Thumbnail" class="w-full object-cover rounded shadow-md mb-2" />
        <h2 class="text-3xl font-bold">{{ event.location }}</h2>
        <p class="text-gray-600">
          {{ formatDate(event.time_start) }} - {{ formatDate(event.time_end) }}
        </p>
      </div>

      <!-- Description Section -->
      <div>
        <h3 class="text-lg font-semibold">Description:</h3>
        <p class="text-gray-700">{{ event.description }}</p>
      </div>

      <!-- Notes Section -->
      <div>
        <h3 class="text-lg font-semibold">Notes:</h3>
        <p class="text-gray-700">{{ event.notes || "No notes available" }}</p>
      </div>

      <!-- Edit Buttons Section -->
      <div class="flex space-x-4">
        <button class="p-2 px-4 bg-green-500 text-white rounded shadow">Edit Description</button>
        <button class="p-2 px-4 bg-green-500 text-white rounded shadow">Edit Notes</button>
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
  </div>
</template>

<script>
import EventActivities from './EventActivities.vue';
import EventBudgets from './EventBudgets.vue';

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
  },
  methods: {
    formatDate(date) {
      const options = { hour: 'numeric', minute: 'numeric', hour12: true };
      return new Date(date).toLocaleTimeString([], options);
    },
  },
};
</script>

<style scoped>
/* Add custom styling if necessary */
</style>
