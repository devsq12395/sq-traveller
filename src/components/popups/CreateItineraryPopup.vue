<template>
    <div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div class="bg-white p-6 rounded shadow-lg">
        <h2 class="text-2xl font-bold mb-4">Create an Itinerary</h2>
        <form @submit.prevent="handleCreateItinerary" class="space-y-4">
          <input
            type="text"
            v-model="itinerary.name"
            placeholder="Itinerary Name"
            required
            class="w-full p-2 border border-gray-300 rounded"
          />
          <textarea
            v-model="itinerary.description"
            placeholder="Itinerary Description"
            required
            class="w-full p-2 border border-gray-300 rounded"
          ></textarea>
          <input
            type="datetime-local"
            v-model="itinerary.time_start"
            required
            class="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="datetime-local"
            v-model="itinerary.time_end"
            required
            class="w-full p-2 border border-gray-300 rounded"
          />
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
  import { useUser } from '../../context/UserContext';
  import { createItinerary } from '../../helpers/itinerary';
  
  export default {
    name: 'CreateItineraryPopup',
    emits: ['close', 'refresh'],
    setup(_, { emit }) {
      const itinerary = ref({
        name: '',
        description: '',
        time_start: '',
        time_end: '',
      });
      const user = useUser();
  
      // Handle itinerary creation
      const handleCreateItinerary = async () => {
        const { error } = await createItinerary(
          user.user_id,
          itinerary.value.name,
          itinerary.value.description,
          itinerary.value.time_start,
          itinerary.value.time_end
        );
  
        if (!error) {
          emit('refresh'); // Refresh the list on success
          closePopup(); // Close the popup
        } else {
          console.error('Error creating itinerary:', error.message);
        }
      };
  
      // Close the popup
      const closePopup = () => {
        itinerary.value = { name: '', description: '', time_start: '', time_end: '' };
        emit('close');
      };
  
      return {
        itinerary,
        handleCreateItinerary,
        closePopup,
      };
    },
  };
  </script>
  
  <style scoped>
  /* Additional styles if needed */
  </style>
  