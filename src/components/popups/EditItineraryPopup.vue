<template>
  <div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div class="bg-white p-6 rounded shadow-lg w-[900px]">
      <h2 class="text-2xl font-bold mb-4">Edit Itinerary</h2>
      <form @submit.prevent="handleEditItinerary" class="space-y-6">
        <div v-if="errorMessage" class="text-red-500 mb-4">{{ errorMessage }}</div>
        <div :class="{'flex gap-6 relative': isDesktop, 'block': !isDesktop}">
          <!-- Left Side: Itinerary Details -->
          <div class="w-full md:w-1/2 flex flex-col gap-4">
            <h3 class="text-lg font-semibold">Itinerary Details</h3>

            <!-- Itinerary Name Field -->
            <div class="grid grid-cols-3 items-start gap-2">
              <label for="name" class="text-gray-700 font-semibold text-left">Itinerary Name: <span class="text-gray-500">({{ itinerary.name.length }}/80)</span></label>
              <input
                type="text"
                id="name"
                v-model="itinerary.name"
                placeholder="Itinerary Name"
                required
                class="col-span-2 p-2 border border-gray-300 rounded"
                maxlength="80"
              />
            </div>

            <!-- Itinerary Description Field -->
            <div class="grid grid-cols-3 items-start gap-2">
              <label for="description" class="text-gray-700 font-semibold text-left">Short Description: <span class="text-gray-500">({{ itinerary.description.length }}/200)</span></label>
              <textarea
                id="description"
                v-model="itinerary.description"
                placeholder="Itinerary Description"
                required
                class="col-span-2 p-2 border border-gray-300 rounded"
                maxlength="200"
              ></textarea>
            </div>

            <!-- Number of Days Field -->
            <div class="grid grid-cols-3 items-start gap-2">
              <label for="days" class="text-gray-700 font-semibold text-left">Number of Days:<span class="text-gray-500"> (Up to 15 days)</span></label>
              <input
                type="number"
                id="days"
                v-model="itinerary.days"
                placeholder="Number of days"
                required
                class="col-span-2 p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-4">
          <button type="button" @click="emit('close')" class="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded">Save Changes</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { editItinerary } from '../../helpers/itinerary';

export default {
  name: 'EditItineraryPopup',
  emits: ['close', 'refresh'],
  setup(_, { emit }) {
    const itinerary = ref({
      name: '',
      description: '',
      days: 0,
    });

    const errorMessage = ref('');
    const isDesktop = ref(window.innerWidth >= 768);
    const itineraryId = ref(''); // Assuming you have the itineraryId

    const handleEditItinerary = async () => {
      if (itinerary.value.name && itinerary.value.description && itinerary.value.days > 0) {
        const { error } = await editItinerary(itineraryId.value, {...itinerary.value});
        if (error) {
          errorMessage.value = 'Failed to edit itinerary. Please try again.';
          return;
        }
        emit('refresh');
        emit('close');
      } else {
        errorMessage.value = 'Please fill out all fields correctly.';
      }
    };

    return {
      itinerary,
      errorMessage,
      isDesktop,
      handleEditItinerary,
    };
  },
};
</script>

<style scoped>
.bg-gray-900 {
  background-color: #1a202c;
}
</style>