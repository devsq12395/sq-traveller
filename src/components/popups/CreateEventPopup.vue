<template>
  <div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div class="bg-gray-100 p-6 rounded shadow-lg w-[900px]">
      <h2 class="text-2xl font-bold mb-4">Create an Event</h2>
      <div class="border-b border-gray-200 mb-6"></div>
      
      <form @submit.prevent="handleCreateEvent" class="space-y-6">
        <!-- Content Container -->
        <div class="flex gap-6 relative">
          <!-- Vertical Divider Line -->
          <div class="absolute left-1/2 top-0 bottom-0 border-l border-gray-200"></div>
          
          <!-- Left Column - Event Details -->
          <div class="flex-1 space-y-4">
            <!-- Name Field -->
            <div class="grid grid-cols-3 items-start gap-2">
              <label for="name" class="text-gray-700 font-semibold text-left">
                Name:
                <span class="text-sm text-gray-500">({{ event.name.length }}/50)</span>
              </label>
              <input
                type="text"
                id="name"
                v-model="event.name"
                placeholder="Name"
                maxlength="50"
                required
                class="col-span-2 p-2 border border-gray-300 rounded"
              />
            </div>

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
                @input="onLocationInput"
                @blur="onLocationBlur"
                placeholder="Enter location"
                maxlength="50"
                required
                class="col-span-2 p-2 border border-gray-300 rounded"
              />
              <ul v-if="suggestions.length">
                <li v-for="suggestion in suggestions" :key="suggestion.place_id" @click="selectSuggestion(suggestion)">
                  {{ suggestion.description }}
                </li>
              </ul>
              <img v-if="placePhotoUrl" :src="placePhotoUrl" alt="Place photo" />
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

          <!-- Right Column - Image Selection -->
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
                <button type="button" @click="previousPage" class="p-2 bg-gray-300 rounded">Previous</button>
                <span class="text-gray-500 text-sm">Page {{ currentPage }} of {{ totalPages }}</span>
                <button type="button" @click="nextPage" class="p-2 bg-gray-300 rounded">Next</button>
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
              <div v-if="uploading" class="upload-status">Uploading image...</div>
              <div v-if="uploadSuccess" class="upload-status">Image uploaded!</div>

              <!-- Preview Selected Image -->
              <div v-if="selectedImage" class="mt-2">
                <img :src="selectedImage" alt="Selected image" class="h-24 object-cover rounded" />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex justify-end space-x-2 pt-4 border-t border-gray-200">
          <button type="button" @click="closePopup" class="p-2 bg-gray-300 rounded">Cancel</button>
          <button type="submit" class="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">Create</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { createEvent } from '../../helpers/event';
import axios from 'axios';
import { defaultImages } from '../../helpers/globalVariables';
import { fetchAutocompleteSuggestions, fetchPlacePhotos } from '@/helpers/googlePlacesService';

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
      name: '',
      location: '',
      time_start: '',
      time_end: '',
      description: '',
      day: 1,
      img_url: ''
    });

    const selectedImage = ref(null);
    const imageFile = ref(null);
    const currentPage = ref(1);
    const itemsPerPage = 6; // Show 6 images per page (2 rows of 3)

    const uploading = ref(false);
    const uploadSuccess = ref(false);

    const suggestions = ref([]);
    const placePhotoUrl = ref('');

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

    const handleImageUpload = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      uploading.value = true;
      uploadSuccess.value = false;

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
        event.value.img_url = response.data.secure_url;
        selectedImage.value = response.data.secure_url;

        uploadSuccess.value = true;
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        uploading.value = false;
      }
    };

    const onLocationInput = async () => {
      if (event.value.location.length > 2) {
        suggestions.value = await fetchAutocompleteSuggestions(event.value.location);
      } else {
        suggestions.value = [];
      }
    };

    const onLocationBlur = async () => {
      if (suggestions.value.length) {
        const photoReference = suggestions.value[0].photos ? suggestions.value[0].photos[0].photo_reference : null;
        if (photoReference) {
          placePhotoUrl.value = await fetchPlacePhotos(photoReference);
        }
      }
    };

    const selectSuggestion = (suggestion) => {
      event.value.location = suggestion.description;
      suggestions.value = [];
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
            img_url: finalImageUrl || selectedImage.value
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
      currentPage,
      totalPages,
      paginatedImages,
      handleImageUpload,
      selectDefaultImage,
      handleCreateEvent,
      closePopup,
      nextPage,
      previousPage,
      uploading,
      uploadSuccess,
      suggestions,
      placePhotoUrl,
      onLocationInput,
      onLocationBlur,
      selectSuggestion
    };
  }
};
</script>

<style scoped>
.grid-cols-3 > img {
  aspect-ratio: 1;
}

.upload-status {
  margin-top: 10px;
  font-weight: bold;
  color: #555;
}
</style>