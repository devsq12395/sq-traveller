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

        <!-- Image Upload Field -->
        <input
          type="file"
          @change="handleImageUpload"
          accept="image/*"
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
import { createEvent, saveEventImage } from '../../helpers/event';
import axios from 'axios';

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
    const imageUrl = ref('');

    // Handles image upload
    const handleImageUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const uploadPreset = process.env.VUE_APP_CLOUDINARY_UPLOAD_PRESET;
        const cloudinaryUrl = process.env.VUE_APP_CLOUDINARY_URL;

        // Check if variables are defined
        if (!uploadPreset || !cloudinaryUrl) {
          console.error("Cloudinary environment variables are missing.");
          return;
        }

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

    // Handles event creation
    const handleCreateEvent = async () => {
      const { data, error } = await createEvent(props.itineraryId, event.value);

      if (!error && data) {
        if (imageUrl.value) {
          try {
            await saveEventImage(data[0].id, imageUrl.value); // Save event image
            console.log("Event image saved successfully");
          } catch (imgError) {
            console.error("Error saving event image:", imgError);
          }
        }
        emit('refresh'); // Refresh event list
        closePopup();
      } else {
        console.error('Error creating event:', error.message);
      }
    };

    // Closes the popup
    const closePopup = () => {
      event.value = { location: '', description: '', time_start: '', time_end: '' }; // Reset form
      emit('close'); // Emit close event
    };

    return {
      event,
      handleCreateEvent,
      handleImageUpload,
      closePopup,
    };
  },
};
</script>

<style scoped>
/* Optional styles */
</style>
