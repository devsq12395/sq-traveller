<template>
  <div class="result-container">
    <div class="grid grid-cols-3 items-start gap-2 mt-4">
      <label for="location" class="text-gray-700 font-semibold text-left">
        Location:
      </label>
      <input
        type="text"
        id="location"
        v-model="searchInput"
        @input="fetchSuggestions"
        @complete-location="completeLocation"
        placeholder="Enter location"
        maxlength="50"
        required
        class="col-span-2 p-2 border border-gray-300 rounded"
      />
    </div>
    <div v-if="selectedImage" class="mt-4">
      <img :src="selectedImage" alt="Selected Image Preview" class="w-full h-32 object-cover rounded" />
    </div>
    <div class="mt-4">
      <div v-if="suggestions.length">
        <CreateEventAutoSearchResultBox
          v-for="suggestion in suggestions.slice(0, 4)"
          :key="suggestion.place_id"
          :result="{ 
            name: suggestion.structured_formatting.main_text, 
            description: suggestion.description, 
            place_id: suggestion.place_id,  
            image: null 
          }"
          :setLocation="setLocation"
          :setImageURL="setImageURL"
          @complete-location="completeLocation"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { fetchAutocompleteSuggestions } from '@/helpers/googlePlacesService';
import CreateEventAutoSearchResultBox from './CreateEventAutoSearchResultBox.vue';

export default {
  name: 'CreateEventAutoSearch',
  components: { CreateEventAutoSearchResultBox },
  props: {
    setLocation: Function,
  },
  setup() {
    const searchInput = ref('');
    const suggestions = ref([]);
    const selectedImage = ref(null);

    const fetchSuggestions = async () => {
      if (searchInput.value.length > 0) {
        suggestions.value = await fetchAutocompleteSuggestions(searchInput.value);
        console.log('Suggestions:', suggestions.value);
      } else {
        suggestions.value = [];
      }
    };

    const completeLocation = (description) => {
      searchInput.value = description;
    };

    const setImageURL = (url) => {
      selectedImage.value = url;
    };

    return {
      searchInput,
      suggestions,
      fetchSuggestions,
      completeLocation,
      selectedImage,
      setImageURL,
    };
  },
};
</script>

<style scoped>
.result-container {
  min-height: 650px;
  max-height: 650px;
  overflow-y: auto;
  overflow-x: hidden;
}
/* Add styles here if needed */
</style>
