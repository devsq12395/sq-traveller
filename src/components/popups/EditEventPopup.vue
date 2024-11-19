<template>
  <div class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
    <div class="bg-white p-6 rounded shadow-lg w-96">
      <h2 class="text-2xl font-bold mb-4">Edit Event</h2>

      <form @submit.prevent="handleEditEvent" class="space-y-4">
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

        <!-- Time Start Field -->
        <div class="grid grid-cols-3 items-start gap-2">
          <label for="time_start" class="text-gray-700 font-semibold text-left">Start Time:</label>
          <input
            type="time"
            id="time_start"
            v-model="event.time_start"
            placeholder="Start Time"
            required
            class="col-span-2 p-2 border border-gray-300 rounded"
          />
        </div>
        <!-- Time End Field -->
        <div class="grid grid-cols-3 items-start gap-2">
          <label for="time_end" class="text-gray-700 font-semibold text-left">End Time:</label>
          <input
            type="time"
            id="time_end"
            v-model="event.time_end"
            placeholder="End Time"
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
          <button type="submit" class="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">Save Changes</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { updateEvent, saveEventImage, fetchEvent } from '../../helpers/event';
import { useEvent } from '../../context/UserContext';
import axios from 'axios';

export default {
  name: 'EditEventPopup',
  emits: ['close', 'refresh'],
  setup(_, { emit }) {
    const { eventId } = useEvent();
    const event = ref({
      location: '',
      description: '',
      day: 0,
    });
    const imageUrl = ref('');

    onMounted(async () => {
      if (eventId) {
        const { data, error } = await fetchEvent(eventId);
        if (!error && data) {
          event.value = {
            location: data.location,
            description: data.description,
            day: data.day || 0,
          };
          imageUrl.value = data.img_url || '';
        } else {
          console.error('Error fetching event data:', error?.message);
        }
      }
    });

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

    const handleEditEvent = async () => {
      const { error } = await updateEvent(eventId, event.value);

      if (!error) {
        if (imageUrl.value) {
          try {
            await saveEventImage(eventId, imageUrl.value);
            console.log("Event image updated successfully");
          } catch (imgError) {
            console.error("Error updating event image:", imgError);
          }
        }
        emit('refresh');
        closePopup();
      } else {
        console.error('Error updating event:', error.message);
      }
    };

    const closePopup = () => {
      emit('close');
    };

    return {
      event,
      handleEditEvent,
      handleImageUpload,
      closePopup,
    };
  },
};
</script>

<style scoped>
/* Optional styles */
</style>
