<template>
  <div v-if="isDesktop" class="itinerary-headline flex flex-col justify-end items-center border mx-auto sticky top-0 z-10" :style="{ width: '30%', height: '50vh', backgroundImage: `url(${itineraryImgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }">
    <div class="bg-white bg-opacity-75 p-4 w-full text-center" style="margin-top: 40%;">
      <h1 class="text-3xl font-bold mb-2">{{ title }}</h1>
      <hr class="my-2" />
      <p class="text-gray-700 mb-4">{{ description }}</p>
      <hr class="my-2" />
      <div class="text-sm text-gray-600 text-left mt-4">
        <p>Number of Days: {{ numberOfDays }}</p>
        <p>Total Budget: ${{ totalBudget }}</p>
        <p>Created by: <a :href="`https://goagenda.net/user/${createdBy}`" class="text-blue-500 underline">{{ createdBy }}</a></p>
      </div>
      <div class="flex items-center mt-2">
        <span class="text-sm text-gray-600 mr-2">Ratings: {{ ratingsCount }}</span>
        <div class="flex justify-center space-x-1">
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
        <span class="ml-2 text-sm text-gray-600">Average: {{ averageRating.toFixed(1) }}</span>
      </div>
    </div>
  </div>
  <div v-else class="itinerary-headline flex flex-col justify-end items-center border mx-auto" :style="{ width: '100%', height: '100vh', backgroundImage: `url(${itineraryImgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }">
    <div class="bg-white bg-opacity-75 p-4 w-full text-center" style="margin-top: 40%;">
      <h1 class="text-3xl font-bold mb-2">{{ title }}</h1>
      <hr class="my-2" />
      <p class="text-gray-700 mb-4">{{ description }}</p>
      <hr class="my-2" />
      <div class="text-sm text-gray-600 text-left mt-4">
        <p>Number of Days: {{ numberOfDays }}</p>
        <p>Total Budget: ${{ totalBudget }}</p>
        <p>Created by: {{ createdBy }}</p>
      </div>
      <div class="flex items-center mt-2">
        <span class="text-sm text-gray-600 mr-2">Ratings: {{ ratingsCount }}</span>
        <div class="flex justify-center space-x-1">
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
        <span class="ml-2 text-sm text-gray-600">Average: {{ averageRating.toFixed(1) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { fetchItineraryWithCreator } from '../../helpers/itinerary';
import { fetchRatings } from '../../helpers/itineraryRatings';
import { calculateTotalBudget } from '@/helpers/budgets';
import { useItinerary } from '../../context/UserContext';

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
  setup(props) {
    const isDesktop = ref(window.innerWidth >= 640);
    const numberOfDays = ref(0);
    const createdBy = ref('');
    const itineraryImgUrl = ref('');
    const totalBudget = ref(0);
    const averageRating = ref(0);
    const ratingsCount = ref(0);
    const itineraryContext = useItinerary();

    const refreshData = async () => {
      const { data } = await fetchItineraryWithCreator(props.itineraryId);
      if (data) {
        numberOfDays.value = data.days;
        createdBy.value = data.creatorName;
        itineraryImgUrl.value = data.img_url;
        const budgetData = await calculateTotalBudget(props.itineraryId);
        if (!budgetData.error) {
          totalBudget.value = budgetData.total;
        }
      }
      const ratingsData = await fetchRatings(props.itineraryId);
      if (ratingsData.data) {
        const total = ratingsData.data.reduce((sum, rating) => sum + rating.rating, 0);
        averageRating.value = ratingsData.data.length > 0 ? total / ratingsData.data.length : 0;
        ratingsCount.value = ratingsData.data.length;
      }
    };

    const checkWindowSize = () => {
      isDesktop.value = window.innerWidth >= 640;
    };

    window.addEventListener('resize', checkWindowSize);

    onUnmounted(() => {
      window.removeEventListener('resize', checkWindowSize);
    });

    watch(() => itineraryContext.lastRefresh, refreshData);

    onMounted(refreshData);

    return {
      isDesktop,
      numberOfDays,
      createdBy,
      itineraryImgUrl,
      totalBudget,
      averageRating,
      ratingsCount
    };
  }
}
</script>

<style scoped>
.itinerary-headline {
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

@media (max-width: 640px) {
  .itinerary-headline {
    flex-direction: column;
    align-items: center;
  }
  .itinerary-headline img {
    width: 100%;
  }
  .itinerary-headline div {
    width: 100%;
    text-align: center;
  }
}
</style>
