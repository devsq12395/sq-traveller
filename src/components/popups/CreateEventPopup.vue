<template>
  <div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div class="bg-white p-6 rounded shadow-lg w-96">
      <h2 class="text-2xl font-bold mb-4">Create an Event</h2>
      
      <form @submit.prevent="handleCreateEvent" class="space-y-4">
        <!-- Location Field -->
        <div class="grid grid-cols-3 items-start gap-2">
          <label for="location" class="text-gray-700 font-semibold text-left">Location:</label>
          <input
            type="text"
            id="location"
            v-model="event.location"
            placeholder="Location"
            required
            class="col-span-2 p-2 border border-gray-300 rounded"
          />
        </div>

        <!-- Description Field -->
        <div class="grid grid-cols-3 items-start gap-2">
          <label for="description" class="text-gray-700 font-semibold text-left">Description:</label>
          <textarea
            id="description"
            v-model="event.description"
            placeholder="Description"
            required
            class="col-span-2 p-2 border border-gray-300 rounded"
          ></textarea>
        </div>

        <!-- Day Field -->
        <div class="grid grid-cols-3 items-start gap-2">
          <label for="day" class="text-gray-700 font-semibold text-left">Event Day:</label>
          <input
            type="number"
            id="day"
            v-model="event.day"
            placeholder="Day"
            required
            class="col-span-2 p-2 border border-gray-300 rounded"
          />
        </div>

        <!-- Image Upload Field -->
        <div class="grid grid-cols-3 items-start gap-2">
          <label for="image" class="text-gray-700 font-semibold text-left">Image:</label>
          <input
            type="file"
            id="image"
            @change="handleImageUpload"
            accept="image/*"
            class="col-span-2 p-2 border border-gray-300 rounded"
          />
        </div>

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
      day: 0
    });
    const imageUrl = ref('');

    // Handles image upload
    const handleImageUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const uploadPreset = process.env.VUE_APP_CLOUDINARY_UPLOAD_PRESET;
        const cloudinaryUrl = process.env.VUE_APP_CLOUDINARY_URL;

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
      event.value = { location: '', description: '', day: 0 }; // Reset form
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
