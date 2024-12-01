<template>
  <div 
    @click="navigateToItinerary"
    class="bg-purple-50 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
  >
    <img :src="itinerary.img_url" :alt="itinerary.name" class="w-full object-cover aspect-[4/3]" />
    <div class="p-4">
      <h3 class="text-xl font-semibold mb-2">{{ itinerary.name }}</h3>
      <p class="text-gray-600 mb-2">{{ itinerary.description }}</p>
      <div class="flex justify-between items-center text-sm text-gray-500">
        <span>By {{ itinerary.creatorName }}</span>
        <span>{{ formatDate(itinerary.created_at) }}</span>
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
      formatDate
    };
  }
};
</script>
