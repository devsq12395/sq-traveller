<template>
  <div @click="selectResult" class="result-box flex items-center">
    <img v-if="imageUrl" :src="imageUrl" alt="Result image" class="w-16 h-16 object-cover rounded mr-4" />
    <div class="text-left">
      <h3 class="font-semibold">{{ result.description }}</h3>
      <p>{{ result.secondary_text }}</p>
    </div>
  </div>
</template>

<script>
import { fetchPlaceDetails, fetchPlacePhotos } from '@/helpers/googlePlacesService';
import gsap from 'gsap';

export default {
  name: 'CreateEventAutoSearchResultBox',
  props: {
    result: Object,
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
            const placeDetails = await fetchPlaceDetails(newResult.place_id);
            if (placeDetails.photos && placeDetails.photos.length > 0) {
              const photoReference = placeDetails.photos[0].photo_reference;
              this.imageUrl = await fetchPlacePhotos(photoReference);
            } else {
              this.imageUrl = null;
            }
          } catch (error) {
            console.error('Error fetching place details or photos:', error);
          }
        }
      },
    },
  },
  mounted() {
    this.addHoverEffects();
  },
  methods: {
    addHoverEffects() {
      const box = this.$el;
      gsap.set(box, { scale: 1, backgroundColor: '#fff' });
      box.addEventListener('mouseenter', () => {
        gsap.to(box, { scale: 1.05, backgroundColor: '#f0f0f0', duration: 0.3 });
      });
      box.addEventListener('mouseleave', () => {
        gsap.to(box, { scale: 1, backgroundColor: '#fff', duration: 0.3 });
      });
      box.addEventListener('mousedown', () => {
        gsap.to(box, { backgroundColor: '#e0e0e0', duration: 0.1 });
      });
      box.addEventListener('mouseup', () => {
        gsap.to(box, { backgroundColor: '#f0f0f0', duration: 0.1 });
      });
    },
    selectResult() {
      console.log('Selected result:', this.result);
      this.setLocation(this.result.description);
      this.$emit('complete-location', this.result.description);
      if (this.imageUrl) {
        console.log('Selected image URL:', this.imageUrl);
        this.setImageURL(this.imageUrl);
      }
    },
  },
};
</script>

<style scoped>
.result-box {
  cursor: pointer;
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  transition: transform 0.3s ease, background-color 0.3s ease;
}
</style>
