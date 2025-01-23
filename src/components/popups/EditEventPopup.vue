<template>
  <div class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-gray-100 p-6 rounded shadow-lg w-[900px]">
      <h2 class="text-2xl font-bold mb-4">Edit Event</h2>
      <div class="border-b border-gray-200 mb-6"></div>

      <form @submit.prevent="handleEditEvent" class="space-y-6">
        <div :class="{'flex gap-6 relative': isDesktop, 'block': !isDesktop}">
          <!-- Vertical Divider Line -->
          <div class="absolute left-1/2 top-0 bottom-0 border-l border-gray-200"></div>
          <!-- Left Column - Event Details -->
          <div class="flex-1 space-y-4">
            <!-- Name Field -->
            <div class="grid grid-cols-3 items-start gap-2">
              <label for="name" class="text-gray-700 font-semibold text-left">
                Name:
                <span class="text-sm text-gray-500">({{ event.name ? event.name.length : 0 }}/50)</span>
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

            <!-- Short Description Field -->
            <div class="grid grid-cols-3 items-start gap-2">
              <label for="description" class="text-gray-700 font-semibold text-left">
                Short Description:
                <span class="text-sm text-gray-500">({{ event.shortDescription.length }}/100)</span>
              </label>
              <textarea
                id="shortDescription"
                v-model="event.shortDescription"
                placeholder="Short Description"
                maxlength="100"
                required
                rows="2"
                class="col-span-2 p-2 border border-gray-300 rounded"
              ></textarea>
            </div>

            <!-- Description Field -->
            <div class="grid grid-cols-3 items-start gap-2">
              <label for="description" class="text-gray-700 font-semibold text-left">
                Description:
                <span class="text-sm text-gray-500">({{ event.description.length }}/1000)</span>
              </label>
              <textarea
                id="description"
                v-model="event.description"
                placeholder="Description"
                maxlength="1000"
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
                type="button"
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
                type="button"
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
              />
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
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { updateEvent, saveEventImage, fetchEvent } from '../../helpers/event';
import { defaultImages } from '../../helpers/globalVariables';
import { fetchAutocompleteSuggestions, fetchPlacePhotos } from '@/helpers/googlePlacesService';
import { refreshItinerary } from '../../context/UserContext';
import CreateEventAutoSearch from './CreateEventAutoSearch.vue';
import CreateEventManualInput from './CreateEventManualInput.vue';
import axios from 'axios';

export default {
  name: 'EditEventPopup',
  components: {
    CreateEventAutoSearch,
    CreateEventManualInput,
  },
  props: {
    eventId: {
      type: String,
      required: true
    }
  },
  emits: ['close', 'refresh'],
  setup(props, { emit }) {
    const event = ref({
      name: '',
      location: '',
      description: '',
      shortDescription: '',
      day: 0,
      time_start: '',
      time_end: ''
    });
    const isDesktop = ref(window.innerWidth >= 640);

    const imageUrl = ref('');
    const selectedImage = ref(null);
    const imageFile = ref(null);
    const currentPage = ref(1);
    const itemsPerPage = 6; // Show 6 images per page (2 rows of 3)
    
    const suggestions = ref([]);
    const placePhotoUrl = ref('');

    const activeTab = ref('auto');

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
      window.addEventListener('resize', checkWindowSize);

      if (props.eventId) {
        const { data, error } = await fetchEvent(props.eventId);
        if (!error && data) {
          event.value = {
            name: data.name || '',
            location: data.location || '',
            description: data.description || '',
            shortDescription: data.short_description || '',
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
    onUnmounted(() => {
      window.removeEventListener('resize', checkWindowSize);
    });
    const checkWindowSize = () => {
      isDesktop.value = window.innerWidth >= 640;
    };

    const onLocationInput = async () => {
      suggestions.value = await fetchAutocompleteSuggestions(event.value.location);
    };

    const onLocationBlur = async () => {
      if (suggestions.value.length) {
        const photoReference = suggestions.value[0].photos ? suggestions.value[0].photos[0].photo_reference : null;
        if (photoReference) {
          placePhotoUrl.value = await fetchPlacePhotos(photoReference);
        }
      }
    };

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
          name: event.value.name,
          location: event.value.location,
          description: event.value.description,
          short_description: event.value.shortDescription,
          day: event.value.day,
          time_start: event.value.time_start,
          time_end: event.value.time_end
        };

        console.log('Sending event data:', eventData);
        const { error } = await updateEvent(props.eventId, eventData);
        if (error) console.log('Update response error:', error);

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
          emit('eventUpdated');
          refreshItinerary();
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

    const setLocation = (location) => {
      event.value.location = location;
    };

    const setImageURL = (imgUrl) => {
      imageUrl.value = imgUrl;
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
      onLocationInput,
      onLocationBlur,
      placePhotoUrl,
      activeTab,
      setLocation,
      setImageURL,
      isDesktop
    };
  },
};
</script>

<style scoped>
/* Optional styles */
</style>