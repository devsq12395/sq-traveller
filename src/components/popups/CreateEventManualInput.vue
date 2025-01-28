<template>
  <div>
    <div v-if="hasLocation" class="grid grid-cols-3 items-start gap-2 mt-4">
      <label for="location" class="text-gray-700 font-semibold text-left">
        Location:
      </label>
      <input
        type="text"
        id="location"
        placeholder="Enter location"
        maxlength="50"
        required
        class="col-span-2 p-2 border border-gray-300 rounded"
        @input="setLocation($event.target.value)"
      />
    </div>
    <div class="space-y-4">
      <label class="block text-gray-700 font-semibold text-left mb-2">Image</label>
      <!-- Default Images Grid -->
      <div class="grid grid-cols-3 gap-2">
        <div
          v-for="(image, index) in paginatedImages"
          :key="index"
          @click="selectDefaultImage(image)"
          :class="[
            'cursor-pointer border-2 rounded p-1 hover:border-blue-500',
            selectedImage === image.url ? 'border-blue-500 bg-blue-100' : 'border-gray-200'
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
        <h4 class="text-sm font-semibold">Image Preview:</h4>
        <img :src="selectedImage" alt="Selected image preview" class="h-24 object-cover rounded" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { defaultImages } from '../../helpers/globalVariables';

export default {
  name: 'CreateEventManualInput',
  props: {
    setLocation: Function,
    setImageURL: Function,
    hasLocation: { type: Boolean, default: true }
  },
  data() {
    return {
      selectedImage: null,
      imageFile: null,
      currentPage: 1,
      totalPages: Math.ceil(defaultImages.length / 6),
      uploading: false,
      uploadSuccess: false,
    };
  },
  computed: {
    paginatedImages() {
      const start = (this.currentPage - 1) * 6;
      const end = start + 6;
      return defaultImages.slice(start, end);
    },
  },
  methods: {
    selectDefaultImage(image) {
      this.setImageURL(image.url);
      this.selectedImage = image.url;
      this.imageFile = null; // Clear any uploaded file
    },
    async handleImageUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      this.uploading = true;
      this.uploadSuccess = false;

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
        this.setImageURL(response.data.secure_url);

        this.uploadSuccess = true;
        this.selectedImage = response.data.secure_url;
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        this.uploading = false;
      }
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
  },
};
</script>

<style scoped>
/* Add styles here if needed */
</style>
