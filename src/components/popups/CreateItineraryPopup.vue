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
        <!-- Image Upload Section -->
        <input
          type="file"
          @change="handleImageUpload"
          accept="image/*"
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
import { createItinerary, saveItineraryImage } from '../../helpers/itinerary';
import axios from 'axios';

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
    const imageUrl = ref('');
    const user = useUser();

    const handleImageUpload = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      try {
        const uploadPreset = process.env.VUE_APP_CLOUDINARY_UPLOAD_PRESET;
        const cloudinaryUrl = process.env.VUE_APP_CLOUDINARY_URL;

        // Check if variables are defined
        if (!uploadPreset || !cloudinaryUrl) {
          console.error("Cloudinary environment variables are missing.");
          return;
        }

        console.log("Cloudinary URL:", cloudinaryUrl);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset);

        const response = await axios.post(cloudinaryUrl, formData);
        imageUrl.value = response.data.secure_url;
        console.log("Image uploaded successfully:", imageUrl.value);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    };


    // Handle itinerary creation
    const handleCreateItinerary = async () => {
      const { data, error } = await createItinerary(
        user.user_id,
        itinerary.value.name,
        itinerary.value.description,
        new Date(itinerary.value.time_start).toLocaleTimeString('en-US', { hour12: false }),
        new Date(itinerary.value.time_end).toLocaleTimeString('en-US', { hour12: false })
      );

      if (error) {
        console.error('Error creating itinerary:', error); // Updated error logging
        return;
      }

      if (data && imageUrl.value) {
        try {
          await saveItineraryImage(data[0].id, imageUrl.value);
        } catch (imgError) {
          console.error('Error saving itinerary image:', imgError);
        }
      }

      emit('refresh'); // Refresh the list on success
      closePopup(); // Close the popup
    };


    // Close the popup
    const closePopup = () => {
      itinerary.value = { name: '', description: '', time_start: '', time_end: '' };
      emit('close');
    };

    return {
      itinerary,
      handleCreateItinerary,
      handleImageUpload,
      closePopup,
    };
  },
};
</script>

<style scoped>
/* Additional styles if needed */
</style>
