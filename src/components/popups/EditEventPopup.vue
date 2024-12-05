<template>
  <div class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
    <div class="bg-white p-6 rounded shadow-lg w-[900px]">
      <h2 class="text-2xl font-bold mb-4">Edit Event</h2>
      <div class="border-b border-gray-200 mb-6"></div>

      <form @submit.prevent="handleEditEvent" class="space-y-6">
        <div class="flex gap-6 relative">
          <!-- Vertical Divider Line -->
          <div class="absolute left-1/2 top-0 bottom-0 border-l border-gray-200"></div>
          <!-- Left Column - Event Details -->
          <div class="flex-1 space-y-4">
            <!-- Location Field -->
            <div class="grid grid-cols-3 items-start gap-2">
              <label for="location" class="text-gray-700 font-semibold text-left">
                Location:
                <span class="text-sm text-gray-500">({{ event.location.length }}/50)</span>
              </label>
              <input
                type="text"
                id="location"
                v-model="event.location"
                placeholder="Location"
                maxlength="50"
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
              <label for="description" class="text-gray-700 font-semibold text-left">
                Description:
                <span class="text-sm text-gray-500">({{ event.description.length }}/500)</span>
              </label>
              <textarea
                id="description"
                v-model="event.description"
                placeholder="Description"
                maxlength="500"
                required
                rows="4"
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
          </div>

          <!-- Right Column - Image Upload -->
          <div class="flex-1 space-y-4">
            <label class="block text-gray-700 font-semibold text-left mb-2">Event Image</label>
            <div class="space-y-4">
              <!-- Default Images Grid -->
              <div class="grid grid-cols-3 gap-2">
                <div
                  v-for="(image, index) in paginatedImages"
                  :key="index"
                  @click="selectDefaultImage(image)"
                  :class="[
                    'cursor-pointer border-2 rounded p-1 hover:border-blue-500',
                    selectedImage === image.url ? 'border-blue-500' : 'border-gray-200'
                  ]"
                >
                  <img :src="image.url" alt="Default event image" class="w-full h-16 object-cover rounded" />
                  <span class="text-xs text-gray-500">{{ image.label }}</span>
                </div>
              </div>

              <!-- Pagination -->
              <div class="flex justify-between">
                <button @click="previousPage" class="p-2 bg-gray-300 rounded">Previous</button>
                <span class="text-gray-500 text-sm">Page {{ currentPage }} of {{ totalPages }}</span>
                <button @click="nextPage" class="p-2 bg-gray-300 rounded">Next</button>
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
        </div>

        <div class="flex justify-end space-x-2 mt-6">
          <button type="button" @click="closePopup" class="p-2 bg-gray-300 rounded">Cancel</button>
          <button type="submit" class="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">Save Changes</button>
        </div>
      </form>

    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { updateEvent, saveEventImage, fetchEvent } from '../../helpers/event';
import { defaultImages } from '../../helpers/globalVariables';
import axios from 'axios';

export default {
  name: 'EditEventPopup',
  props: {
    eventId: {
      type: String,
      required: true
    }
  },
  emits: ['close', 'refresh'],
  setup(props, { emit }) {
    const event = ref({
      location: '',
      description: '',
      day: 0,
      time_start: '',
      time_end: ''
    });
    const imageUrl = ref('');
    const selectedImage = ref(null);
    const imageFile = ref(null);
    const currentPage = ref(1);
    const itemsPerPage = 6; // Show 6 images per page (2 rows of 3)

    // Computed properties for pagination
    const totalPages = computed(() => Math.ceil(defaultImages.length / itemsPerPage));
    
    const paginatedImages = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return defaultImages.slice(start, end);
    });

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };

    const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    const selectDefaultImage = (image) => {
      selectedImage.value = image.url;
      imageFile.value = null; // Clear any uploaded file
      event.value.img_url = image.url;
    };

    onMounted(async () => {
      if (props.eventId) {
        const { data, error } = await fetchEvent(props.eventId);
        if (!error && data) {
          event.value = {
            location: data.location,
            description: data.description,
            day: data.day || 0,
            time_start: data.time_start || '',
            time_end: data.time_end || '',
            img_url: data.img_url || ''
          };
          imageUrl.value = data.img_url || '';
          selectedImage.value = data.img_url || null;
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

    const handleEditEvent = async (e) => {
      e.preventDefault();
      console.log('handleEditEvent called');
      console.log('Current event data:', event.value);
      console.log('Event ID:', props.eventId);
      
      try {
        const eventData = {
          location: event.value.location,
          description: event.value.description,
          day: event.value.day,
          time_start: event.value.time_start,
          time_end: event.value.time_end
        };

        console.log('Sending event data:', eventData);
        const { error } = await updateEvent(props.eventId, eventData);
        console.log('Update response error:', error);

        if (!error) {
          // If there's a new image URL, save it
          if (imageUrl.value && imageUrl.value !== event.value.img_url) {
            try {
              await saveEventImage(props.eventId, imageUrl.value);
              console.log("Event image updated successfully");
            } catch (imgError) {
              console.error("Error updating event image:", imgError);
            }
          }
          console.log('Event updated successfully, emitting refresh');
          emit('refresh');
          closePopup();
        } else {
          console.error('Error updating event:', error.message);
        }
      } catch (error) {
        console.error('Error in handleEditEvent:', error);
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
      selectedImage,
      paginatedImages,
      nextPage,
      previousPage,
      selectDefaultImage,
      currentPage,
      totalPages,
    };
  },
};
</script>

<style scoped>
/* Optional styles */
</style>