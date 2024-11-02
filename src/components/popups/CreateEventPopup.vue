<template>
  <div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div class="bg-white p-6 rounded shadow-lg w-96">
      <h2 class="text-2xl font-bold mb-4">Create an Event</h2>
      
      <form @submit.prevent="handleCreateEvent" class="space-y-4">
        <!-- Location Field -->
        <input
          type="text"
          v-model="event.location"
          placeholder="Location"
          required
          class="w-full p-2 border border-gray-300 rounded"
        />

        <!-- Description Field -->
        <textarea
          v-model="event.description"
          placeholder="Description"
          required
          class="w-full p-2 border border-gray-300 rounded"
        ></textarea>

        <!-- Start Time Field -->
        <input
          type="datetime-local"
          v-model="event.time_start"
          required
          class="w-full p-2 border border-gray-300 rounded"
        />

        <!-- End Time Field -->
        <input
          type="datetime-local"
          v-model="event.time_end"
          required
          class="w-full p-2 border border-gray-300 rounded"
        />

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-2">
          <button type="button" @click="closePopup" class="p-2 bg-gray-300 rounded">Cancel</button>
          <button type="submit" class="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">Create</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { createEvent } from '../../helpers/itinerary'; // Make sure this path is correct based on your structure

export default {
  name: 'CreateEventPopup',
  props: {
    itineraryId: {
      type: String,
      required: true,
    },
  },
  emits: ['close', 'refresh'],
  setup(props, { emit }) {
    const event = ref({
      location: '',
      description: '',
      time_start: '',
      time_end: '',
    });

    // Handles event creation
    const handleCreateEvent = async () => {
      const { error } = await createEvent(props.itineraryId, event.value);

      if (!error) {
        emit('refresh'); // Refresh the event list in the parent component
        closePopup(); // Close the popup after creation
      } else {
        console.error('Error creating event:', error.message);
      }
    };

    // Closes the popup
    const closePopup = () => {
      event.value = { location: '', description: '', time_start: '', time_end: '' }; // Reset the form
      emit('close'); // Emit close event to parent
    };

    return {
      event,
      handleCreateEvent,
      closePopup,
    };
  },
};
</script>

<style scoped>
/* Optional styles */
</style>
