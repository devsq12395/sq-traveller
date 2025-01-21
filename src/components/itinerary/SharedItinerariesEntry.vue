<template>
  <div v-if="isDesktop" @click="navigateToItinerary" class="bg-purple-50 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer">
    <img :src="itinerary.img_url" :alt="itinerary.name" class="w-full object-cover aspect-[4/3]" />

    <!-- Text Section -->
    <div class="p-4">
      <h3 class="text-xl font-semibold mb-2">{{ itinerary.name }}</h3>
      <p class="text-gray-600 mb-2">{{ itinerary.description }}</p>
      <div class="flex justify-between items-center text-sm text-gray-500">
        <span>By {{ itinerary.creatorName }}</span>
        <span>{{ formatDate(itinerary.created_at) }}</span>
      </div>
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
  <div v-else @click="navigateToItinerary" class="bg-purple-50 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer flex-col p-4">
    <img :src="itinerary.img_url" :alt="itinerary.name" class="w-full object-cover rounded-md mb-4" />
    <div class="p-2 mb-4">
      <h3 class="text-lg font-semibold">{{ itinerary.name }}</h3>
      <p class="text-gray-600 text-sm">{{ itinerary.description }}</p>
      <hr class="my-2" />
    </div>
    <div class="text-sm text-gray-500 text-left">
      <p>Create by {{ itinerary.creatorName }}</p>
      <p><strong>Days:</strong> {{ itinerary.days }}</p>
      <div class="flex items-center">
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
import { useRouter } from 'vue-router';

export default {
  name: 'SharedItinerariesEntry',
  props: {
    itinerary: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const router = useRouter();
    const averageRating = props.itinerary.averageRating || 0;

    const navigateToItinerary = () => {
      router.push(`/itinerary/${props.itinerary.id}`);
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    return {
      navigateToItinerary,
      formatDate,
      averageRating,
      isDesktop: window.innerWidth > 768
    };
  }
};
</script>
