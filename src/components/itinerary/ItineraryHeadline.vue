<template>
  <div class="itinerary-headline flex border bg-blue-100 rounded-lg overflow-hidden mx-auto" style="max-height: 40vh; min-height: 400px; width: 70%;">
    <img :src="itineraryImgUrl" alt="Itinerary Image" class="w-1/3 h-64 object-cover m-2" />
    <div class="p-4 w-2/3">
      <h1 class="text-3xl font-bold mb-2 text-center">{{ title }}</h1>
      <p class="text-gray-700 mb-4 text-left">{{ description }}</p>
      <p class="text-sm text-gray-600 text-left">Number of Days: {{ numberOfDays }}</p>
      <p class="text-sm text-gray-600 text-left">Created by: {{ createdBy }}</p>
    </div>
  </div>
</template>

<script>
import { fetchItineraryWithCreator } from '../../helpers/itinerary';

export default {
  name: 'ItineraryHeadline',
  props: {
    itineraryId: {
      type: String,
      required: true
    },
    image: String,
    title: String,
    description: String,
  },
  data() {
    return {
      numberOfDays: 0,
      createdBy: '',
      itineraryImgUrl: ''
    }
  },
  async created() {
    const { data } = await fetchItineraryWithCreator(this.itineraryId);
    if (data) {
      this.numberOfDays = data.days;
      this.createdBy = data.creatorName;
      this.itineraryImgUrl = data.img_url;
    }
  },
};
</script>

<style scoped>
.itinerary-headline {
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}
</style>
