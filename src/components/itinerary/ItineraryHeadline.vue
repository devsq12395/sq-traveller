<template>
  <div class="itinerary-headline flex border bg-blue-100 rounded-lg overflow-hidden mx-auto" style="max-height: 40vh; min-height: 400px; width: 70%;">
    <img :src="itineraryImgUrl" alt="Itinerary Image" class="w-1/3 h-64 object-cover m-2" />
    <div class="p-4 w-2/3">
      <h1 class="text-3xl font-bold mb-2 text-center">{{ title }}</h1>
      <p class="text-gray-700 mb-4 text-left">{{ description }}</p>
      <hr class="border-t border-gray-300 my-2">
      <p class="text-sm text-gray-600 text-left">Number of Days: {{ numberOfDays }}</p>
      <p class="text-sm text-gray-600 text-left">Created by: {{ createdBy }}</p>
      <div class="flex items-center mt-2">
        <span class="text-sm text-gray-600 mr-2">Ratings:</span>
        <div class="flex space-x-1">
          <span v-for="star in 5" :key="star">
            <svg
              :class="averageRating >= star ? 'text-yellow-500' : 'text-gray-300'"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
              class="w-4 h-4"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.982a1 1 0 00.95.69h4.184c.969 0 1.371 1.24.588 1.81l-3.392 2.466a1 1 0 00-.364 1.118l1.286 3.982c.3.921-.755 1.688-1.54 1.118l-3.392-2.466a1 1 0 00-1.175 0l-3.392 2.466c-.784.57-1.839-.197-1.54-1.118l1.286-3.982a1 1 0 00-.364-1.118L2.83 9.409c-.784-.57-.38-1.81.588-1.81h4.184a1 1 0 00.95-.69l1.286-3.982z" />
            </svg>
          </span>
        </div>
        <span class="ml-2 text-sm text-gray-600">({{ averageRating.toFixed(1) }})</span>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchItineraryWithCreator } from '../../helpers/itinerary';
import { fetchRatings } from '../../helpers/itineraryRatings';

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
      itineraryImgUrl: '',
      averageRating: 0
    }
  },
  async created() {
    const { data } = await fetchItineraryWithCreator(this.itineraryId);
    if (data) {
      this.numberOfDays = data.days;
      this.createdBy = data.creatorName;
      this.itineraryImgUrl = data.img_url;
    }
    const ratingsData = await fetchRatings(this.itineraryId);
    if (ratingsData.data) {
      const total = ratingsData.data.reduce((sum, rating) => sum + rating.rating, 0);
      this.averageRating = ratingsData.data.length > 0 ? total / ratingsData.data.length : 0;
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
