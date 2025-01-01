<template>
  <div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-30">
    <div class="bg-gray-100 p-6 rounded shadow-lg w-full md:w-[900px]" style="max-height: 90vh; margin-top: 5vh;">
      <h2 class="text-2xl font-bold mb-4">Create an Event</h2>
      <div class="border-b border-gray-200 mb-6"></div>
      <div class="overflow-auto" style="max-height: calc(100vh - 300px);">
        <form @submit.prevent="handleCreateEvent" class="space-y-6">
          <!-- Content Container -->
          <div :class="{'flex': isDesktop, 'block': !isDesktop}">
            <!-- Left Column - Event Details -->
            <div class="event-details w-full md:w-1/2">
              <h3 class="text-lg font-semibold">Event Details</h3>
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
            <!-- Right Column - Tabbed Interface for AutoSearch and Manual Input -->
            <div class="location-image w-full md:w-1/2">
              <h3 class="text-lg font-semibold">Location and Image</h3>
              <div class="flex border-b border-gray-200 bg-blue-50">
                <button
                  @click="activeTab = 'auto'"
                  class="px-4 py-2 text-sm font-medium"
                  :class="[
                    activeTab === 'auto'
                      ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-100'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-blue-100'
                  ]"
                >
                  AutoSearch
                </button>
                <button
                  @click="activeTab = 'manual'"
                  class="px-4 py-2 text-sm font-medium"
                  :class="[
                    activeTab === 'manual'
                      ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-100'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-blue-100'
                  ]"
                >
                  Manual Input
                </button>
              </div>
              <div v-if="activeTab === 'auto'">
                <CreateEventAutoSearch 
                  :setLocation="setLocation"
                  :setImageURL="setImageURL"
                />
              </div>
              <div v-if="activeTab === 'manual'">
                <CreateEventManualInput
                  :setLocation="setLocation"
                  :setImageURL="setImageURL"
                  :uploadImage="uploadImage"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
      <div class="actions mt-4 flex justify-between space-x-2">
        <button type="button" @click="closePopup" class="p-2 bg-gray-300 rounded flex-1">Cancel</button>
        <button type="submit" class="p-2 bg-blue-500 text-white rounded flex-1">Create</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { createEvent } from '../../helpers/event';
import axios from 'axios';
import { defaultImages } from '../../helpers/globalVariables';
import { fetchAutocompleteSuggestions, fetchPlacePhotos } from '@/helpers/googlePlacesService';
import CreateEventAutoSearch from './CreateEventAutoSearch.vue';
import CreateEventManualInput from './CreateEventManualInput.vue';

export default {
  name: 'CreateEventPopup',
  components: {
    CreateEventAutoSearch,
    CreateEventManualInput,
  },
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

    const isDesktop = ref(window.innerWidth >= 640);

    const selectedImage = ref(null);
    const imageFile = ref(null);
    const currentPage = ref(1);
    const itemsPerPage = 6; // Show 6 images per page (2 rows of 3)

    const uploading = ref(false);
    const uploadSuccess = ref(false);

    const suggestions = ref([]);
    const placePhotoUrl = ref('');

    const activeTab = ref('auto');

    // Computed properties for pagination
    const totalPages = computed(() => Math.ceil(defaultImages.length / itemsPerPage));

    const checkWindowSize = () => {
      isDesktop.value = window.innerWidth >= 640;
    };
    
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

    const setLocation = (location) => {
      event.value.location = location;
    };

    const setImageURL = (imageUrl) => {
      event.value.img_url = imageUrl;
    };

    onMounted(() => {
      window.addEventListener('resize', checkWindowSize);
    });
    onUnmounted(() => {
      window.removeEventListener('resize', checkWindowSize);
    });

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
      selectSuggestion,
      activeTab,
      setLocation,
      setImageURL,
      isDesktop
    };
  }
};
</script>

<style scoped>
.create-event-popup {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 100vh;
}
.flex {
  display: flex;
}
.block {
  display: block;
}
.event-details, .location-image {
  margin-bottom: 20px;
}
.actions {
  display: flex;
  justify-content: space-between;
}
.grid-cols-3 > img {
  aspect-ratio: 1;
}

.upload-status {
  margin-top: 10px;
  font-weight: bold;
  color: #555;
}
</style>