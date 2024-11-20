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

        <!-- Image Upload and Selection Field -->
        <div class="grid grid-cols-3 items-start gap-2">
          <label class="text-gray-700 font-semibold text-left">Image:</label>
          <div class="col-span-2 space-y-4">
            <!-- Default Images Grid -->
            <div class="grid grid-cols-3 gap-2">
              <div
                v-for="(image, index) in defaultImages"
                :key="index"
                @click="selectDefaultImage(image)"
                :class="[
                  'cursor-pointer border-2 rounded p-1 hover:border-blue-500',
                  selectedImage === image ? 'border-blue-500' : 'border-gray-200'
                ]"
              >
                <img :src="image" alt="Default event image" class="w-full h-16 object-cover rounded" />
              </div>
            </div>

            <!-- Or Divider -->
            <div class="flex items-center my-4">
              <div class="flex-grow border-t border-gray-300"></div>
              <span class="mx-4 text-gray-500 text-sm">or upload your own</span>
              <div class="flex-grow border-t border-gray-300"></div>
            </div>

            <!-- Custom Upload -->
            <input
              type="file"
              id="image"
              @change="handleImageUpload"
              accept="image/*"
              class="w-full p-2 border border-gray-300 rounded"
            />

            <!-- Preview Selected Image -->
            <div v-if="selectedImage" class="mt-2">
              <img :src="selectedImage" alt="Selected image" class="h-24 object-cover rounded" />
            </div>
          </div>
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
import { createEvent } from '../../helpers/event';
import axios from 'axios';

export default {
  name: 'CreateEventPopup',
  props: {
    itineraryId: {
      type: String,
      required: true
    }
  },
  setup(props, { emit }) {
    const event = ref({
      location: '',
      time_start: '',
      time_end: '',
      description: '',
      day: 1,
      img_url: ''
    });

    const selectedImage = ref(null);
    const imageFile = ref(null);

    // Default placeholder images
    const defaultImages = [
      'https://placehold.co/200x200/e5e7eb/a3a3a3?text=Food',
      'https://placehold.co/200x200/e5e7eb/a3a3a3?text=Attraction',
      'https://placehold.co/200x200/e5e7eb/a3a3a3?text=Transport',
      'https://placehold.co/200x200/e5e7eb/a3a3a3?text=Hotel',
      'https://placehold.co/200x200/e5e7eb/a3a3a3?text=Activity',
      'https://placehold.co/200x200/e5e7eb/a3a3a3?text=Shopping'
    ];

    const selectDefaultImage = (image) => {
      selectedImage.value = image;
      imageFile.value = null; // Clear any uploaded file
      event.value.img_url = image;
    };

    const handleImageUpload = (e) => {
      const file = e.target.files[0];
      if (file) {
        imageFile.value = file;
        selectedImage.value = URL.createObjectURL(file);
        event.value.img_url = ''; // Clear any selected default image
      }
    };

    const handleCreateEvent = async () => {
      try {
        let finalImageUrl = event.value.img_url;

        // If a file was uploaded, handle the upload
        if (imageFile.value) {
          const formData = new FormData();
          formData.append('image', imageFile.value);
          const response = await axios.post('YOUR_UPLOAD_URL', formData);
          finalImageUrl = response.data.url;
        }

        // Create event with the image URL
        const { error: eventError } = await createEvent(
          props.itineraryId,
          {
            ...event.value,
            img_url: finalImageUrl || selectedImage.value // Use selected default image if no upload
          }
        );

        if (eventError) throw eventError;

        emit('close');
        emit('refresh');
      } catch (error) {
        console.error('Error creating event:', error);
      }
    };

    const closePopup = () => {
      emit('close');
    };

    return {
      event,
      selectedImage,
      defaultImages,
      handleImageUpload,
      selectDefaultImage,
      handleCreateEvent,
      closePopup
    };
  }
};
</script>

<style scoped>
.grid-cols-3 > img {
  aspect-ratio: 1;
}
</style>