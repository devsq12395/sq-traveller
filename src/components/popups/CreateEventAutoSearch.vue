<template>
  <div>
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
    <div v-if="suggestions.length" class="mt-4">
      <CreateEventAutoSearchResultBox
        v-for="suggestion in suggestions.slice(0, 4)"
        :key="suggestion.place_id"
        :result="{ 
          name: suggestion.structured_formatting.main_text, 
          description: suggestion.description, 
          place_id: suggestion.place_id,  // Include place_id here
          image: null // Remove the inline photo fetch logic
        }"
        :setLocation="setLocation"
        :setImageURL="setImageURL"
        @complete-location="completeLocation"
      />

    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { fetchAutocompleteSuggestions, fetchPlacePhotos } from '@/helpers/googlePlacesService';
import CreateEventAutoSearchResultBox from './CreateEventAutoSearchResultBox.vue';

export default {
  name: 'CreateEventAutoSearch',
  components: { CreateEventAutoSearchResultBox },
  props: {
    setLocation: Function,
    setImageURL: Function,
  },
  setup() {
    const searchInput = ref('');
    const suggestions = ref([]);

    const fetchSuggestions = async () => {
      if (searchInput.value.length > 2) {
        suggestions.value = await fetchAutocompleteSuggestions(searchInput.value);
        console.log ('Suggestions:');
        console.log (suggestions);
      } else {
        suggestions.value = [];
      }
    };

    const completeLocation = (description) => {
      searchInput.value = description;
    };

    return {
      searchInput,
      suggestions,
      fetchSuggestions,
      fetchPlacePhotos,
      completeLocation,
    };
  },
};
</script>

<style scoped>
/* Add styles here if needed */
</style>
