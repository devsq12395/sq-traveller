<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Ratings ({{ ratings.length }})</h2>
    
    <!-- Add Rating Form -->
    <div v-if="userState.username && !userRating" class="mb-6">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="rating-input flex flex-row items-center space-x-1" :class="{'opacity-50': userRating}" :disabled="userRating">
          <span class="text-gray-700 mr-1">Rate:</span>
          <div class="flex space-x-1">
            <span v-for="star in 5" :key="star" @click="newRating = star" class="cursor-pointer">
              <svg
                :class="newRating >= star ? 'text-yellow-500' : 'text-gray-300'"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
                class="w-5 h-5"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.982a1 1 0 00.95.69h4.184c.969 0 1.371 1.24.588 1.81l-3.392 2.466a1 1 0 00-.364 1.118l1.286 3.982c.3.921-.755 1.688-1.54 1.118l-3.392-2.466a1 1 0 00-1.175 0l-3.392 2.466c-.784.57-1.839-.197-1.54-1.118l1.286-3.982a1 1 0 00-.364-1.118L2.83 9.409c-.784-.57-.38-1.81.588-1.81h4.184a1 1 0 00.95-.69l1.286-3.982z" />
              </svg>
            </span>
          </div>
        </div>
        <div>
          <textarea
            v-model="newComment"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50"
            placeholder="Add a comment"
            rows="3"
            :disabled="userRating"
          ></textarea>
        </div>
        <div class="flex justify-end">
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            :disabled="isSubmitting || newRating === 0 || userRating"
          >
            {{ isSubmitting ? 'Submitting...' : 'Submit Rating' }}
          </button>
        </div>
      </form>
    </div>
    <div v-else-if="!userState.username" class="mb-6 p-4 bg-gray-50 rounded-lg text-center">
      <p class="text-gray-600">Please log in to rate.</p>
    </div>

    <!-- Ratings List -->
    <ItineraryRating 
      :ratings="ratings" 
      :currentUser="userState" 
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useUser } from '../../context/UserContext';
import { fetchRatings, addRating } from '../../helpers/itineraryRatings';
import ItineraryRating from './ItineraryRating.vue';

export default {
  props: {
    itineraryId: {
      type: Number,
      required: true
    }
  },
  components: {
    ItineraryRating
  },
  setup(props) {
    const ratings = ref([]);
    const newRating = ref(0);
    const newComment = ref('');
    const isSubmitting = ref(false);
    const userState = useUser();
    const userRating = ref(null);

    const loadRatings = async () => {
      const { data, error } = await fetchRatings(props.itineraryId);
      if (!error) {
        ratings.value = data;
        if (data && data.length > 0) {
          userRating.value = data.find(rating => rating.user_id === userState.user_id);
        }
      }
    };

    const handleSubmit = async () => {
      isSubmitting.value = true;
      const { data, error } = await addRating(props.itineraryId, userState.user_id, newRating.value, newComment.value);
      if (!error) {
        ratings.value.unshift(data);
        newRating.value = 0;
        newComment.value = '';
        userRating.value = data;
      }
      isSubmitting.value = false;
    };

    onMounted(loadRatings);

    return {
      ratings,
      newRating,
      newComment,
      isSubmitting,
      userState,
      userRating,
      handleSubmit
    };
  }
};
</script>

<style scoped>

</style>
