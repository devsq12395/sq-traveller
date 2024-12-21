<template>
  <div @click="selectResult" class="cursor-pointer border p-2 mb-2 hover:bg-gray-100">
    <h3 class="font-semibold">{{ result.description }}</h3>
    <p>{{ result.secondary_text }}</p>
    <img v-if="imageUrl" :src="imageUrl" alt="Result image" class="w-full h-16 object-cover rounded mt-2" />
  </div>
</template>

<script>
import { fetchPlaceDetails, fetchPlacePhotos } from '@/helpers/googlePlacesService';

export default {
  name: 'CreateEventAutoSearchResultBox',
  props: {
    result: Object, // This should include the place_id from the autocomplete suggestions
    setLocation: Function,
    setImageURL: Function,
  },
  data() {
    return {
      imageUrl: null,
    };
  },
  watch: {
    result: {
      immediate: true,
      async handler(newResult) {
        console.log('New result:', newResult);
        if (newResult.place_id) {
          try {
            // Fetch place details using place_id
            const placeDetails = await fetchPlaceDetails(newResult.place_id);

            // Check if photos are available
            if (placeDetails.photos && placeDetails.photos.length > 0) {
              const photoReference = placeDetails.photos[0].photo_reference;

              // Fetch the photo URL
              this.imageUrl = await fetchPlacePhotos(photoReference);
            } else {
              // If no photos are available, set to null or a default placeholder
              this.imageUrl = null;
            }
          } catch (error) {
            console.error('Error fetching place details or photos:', error);
          }
        }
      },
    },
  },
  methods: {
    selectResult() {
      console.log('Selected result:', this.result);
      this.setLocation(this.result.description);
      this.$emit('complete-location', this.result.description);

      if (this.imageUrl) {
        this.setImageURL(this.imageUrl);
      }
    },
  },
};
</script>

<style scoped>
/* Add styles here if needed */
</style>
