<template>
  <div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div class="bg-white p-6 rounded shadow-lg w-[900px]">
      <h2 class="text-2xl font-bold mb-4">Create an Itinerary</h2>
      <form @submit.prevent="handleCreateItinerary" class="space-y-6">
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

          <!-- Right Side: Location and Image -->
          <div class="w-full md:w-1/2">
            <h3 class="text-lg font-semibold">Thumbnail Image</h3>
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
import { ref, onMounted, onUnmounted } from 'vue';
import { useUser } from '../../context/UserContext';
import { createItinerary, saveItineraryImage } from '../../helpers/itinerary';
import axios from 'axios';
import { fetchAutocompleteSuggestions, fetchPlacePhotos } from '@/helpers/googlePlacesService';
import CreateEventAutoSearch from './CreateEventAutoSearch.vue';
import CreateEventManualInput from './CreateEventManualInput.vue';

export default {
  name: 'CreateItineraryPopup',
  emits: ['close', 'refresh'],
  components: {
    CreateEventAutoSearch,
    CreateEventManualInput,
  },
  setup(_, { emit }) {
    const itinerary = ref({
      name: '',
      description: '',
      days: 0
    });
    const imageUrl = ref('');
    const user = useUser();
    const isUploading = ref(false);
    const uploadSuccess = ref(false);

    const suggestions = ref([]);
    const placePhotoUrl = ref('');

    const isDesktop = ref(window.innerWidth >= 640);
    const activeTab = ref('auto');
    const location = ref('');
    const errorMessage = ref('');

    const checkWindowSize = () => {
      isDesktop.value = window.innerWidth >= 640;
    };
    onMounted(() => {
      window.addEventListener('resize', checkWindowSize);
      checkWindowSize();
    });

    onUnmounted(() => {
      window.removeEventListener('resize', checkWindowSize);
    });

    const handleImageUpload = async (event) => {
      const file = event.target.files[0];
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

        isUploading.value = true;
        uploadSuccess.value = false;
        const response = await axios.post(cloudinaryUrl, formData);

        imageUrl.value = response.data.secure_url;

        uploadSuccess.value = true; // Set uploadSuccess to true on success
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        isUploading.value = false; // Ensure isUploading is set to false
      }
    };

    const onLocationInput = async () => {
      suggestions.value = await fetchAutocompleteSuggestions(location.value);
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
      location.value = suggestion.description;
      suggestions.value = [];
    };

    const handleCreateItinerary = async () => {
      try {
        const { data, error } = await createItinerary(
          user.user_id,
          itinerary.value.name,
          itinerary.value.description,
          itinerary.value.days
        );

        if (error) {
          errorMessage.value = 'Error creating itinerary. Please ensure all fields are filled correctly and try again.';
          console.error('Error creating itinerary:', error);
          return;
        }

        if (itinerary.value.days < 1 || itinerary.value.days > 15) {
          errorMessage.value = 'Number of days must be less than or equal to 15.';
          return;
        }

        if (!data) {
          console.error('Itinerary creation returned null data.');
          return;
        }

        if (data && imageUrl.value) {
          try {
            await saveItineraryImage(data[0].id, imageUrl.value);
          } catch (imgError) {
            console.error('Error saving itinerary image:', imgError);
          }
        }

        emit('refresh');
        closePopup();
      } catch (error) {
        console.error('Error creating itinerary:', error);
      }
    };

    const setLocation = (loc) => {
      location.value = loc;
    };

    const setImageURL = (url) => {
      imageUrl.value = url;
    };

    const closePopup = () => {
      itinerary.value = { name: '', description: '', days: 0 };
      emit('close');
    };

    return {
      itinerary,
      handleCreateItinerary,
      handleImageUpload,
      closePopup,
      imageUrl,
      isUploading,
      uploadSuccess,
      isDesktop,
      setImageURL,
      onLocationBlur,
      selectSuggestion,
      onLocationInput,
      setLocation,
      activeTab,
      errorMessage
    };
  },
};
</script>

<style scoped>
.bg-gray-900 {
  z-index: 50;
}
/* Additional styles if needed */
</style>
