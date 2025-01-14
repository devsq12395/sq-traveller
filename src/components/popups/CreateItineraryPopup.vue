<template>
  <div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div class="bg-white p-6 rounded shadow-lg w-[900px]">
      <h2 class="text-2xl font-bold mb-4">Create an Itinerary</h2>
      <form @submit.prevent="handleCreateItinerary" class="space-y-4">
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
          <label for="description" class="text-gray-700 font-semibold text-left">Description: <span class="text-gray-500">({{ itinerary.description.length }}/500)</span></label>
          <textarea
            id="description"
            v-model="itinerary.description"
            placeholder="Itinerary Description"
            required
            class="col-span-2 p-2 border border-gray-300 rounded"
            maxlength="500"
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

        <!-- Image Upload Field -->
        <div class="grid grid-cols-3 items-start gap-2">
          <label class="text-gray-700 font-semibold text-left">Image <span class="text-gray-500">(4:3 ratio recommended)</span>:</label>
          <div class="col-span-2 space-y-2">
            <input
              type="file"
              id="image"
              @change="handleImageUpload"
              accept="image/*"
              class="p-2 border border-gray-300 rounded w-full"
            />
            <div v-if="!uploadSuccess && !isUploading" class="flex items-center gap-2">
              <span class="text-gray-600">or</span>
              <input
                type="url"
                v-model="imageUrl"
                placeholder="Enter image URL"
                class="flex-1 p-2 border border-gray-300 rounded"
              />
            </div>
            <div v-if="isUploading" class="flex items-center gap-2">
              <span class="text-gray-600">Uploading image...</span>
            </div>
            <div v-if="uploadSuccess" class="flex items-center gap-2">
              <span class="text-gray-600">Image uploaded successfully!</span>
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

export default {
  name: 'CreateItineraryPopup',
  emits: ['close', 'refresh'],
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

    const isDesktop = ref(window.innerWidth >= 640);

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

    const handleCreateItinerary = async () => {
      try {
        console.log (user);
        const { data, error } = await createItinerary(
          user.user_id,
          itinerary.value.name,
          itinerary.value.description,
          itinerary.value.days
        );

        if (error) {
          console.error('Error creating itinerary:', error);
          return;
        }

        if (!data) {
          console.error('Itinerary creation returned null data.');
          return;
        }

        if (data && imageUrl.value) {
          try {
            await saveItineraryImage(data[0].id, imageUrl.value);
            console.log('Image saved successfully');
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
      isDesktop
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
