<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Ratings</h2>
    
    <!-- Add Rating Form -->
    <div v-if="userState.username" class="mb-6">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <input
            type="number"
            v-model="newRating"
            min="1"
            max="5"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50"
            placeholder="Rate from 1 to 5"
            required
          />
        </div>
        <div>
          <textarea
            v-model="newComment"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50"
            placeholder="Add a comment"
            rows="3"
          ></textarea>
        </div>
        <div class="flex justify-end">
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? 'Submitting...' : 'Submit Rating' }}
          </button>
        </div>
      </form>
    </div>
    <div v-else class="mb-6 p-4 bg-gray-50 rounded-lg text-center">
      <p class="text-gray-600">Please log in to rate.</p>
    </div>

    <!-- Ratings List -->
    <div class="space-y-4">
      <template v-if="ratings.length > 0">
        <div v-for="rating in ratings" :key="rating.id" class="border rounded-lg p-4 bg-white shadow">
          <p class="text-lg font-semibold">{{ rating.profile.username }}</p>
          <p class="text-gray-600">Rating: {{ rating.rating }}</p>
          <p class="text-gray-600">Comment: {{ rating.comment }}</p>
        </div>
      </template>
      <div v-else class="text-center py-8 text-gray-500">
        No ratings yet. Be the first to rate!
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useUser } from '../../context/UserContext';
import { fetchRatings, addRating } from '../../helpers/itineraryRatings';

export default {
  props: {
    itineraryId: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const ratings = ref([]);
    const newRating = ref(5);
    const newComment = ref('');
    const isSubmitting = ref(false);
    const userState = useUser();

    const loadRatings = async () => {
      const { data, error } = await fetchRatings(props.itineraryId);
      if (!error) {
        ratings.value = data;
      }
    };

    const handleSubmit = async () => {
      isSubmitting.value = true;
      const { data, error } = await addRating(props.itineraryId, userState.id, newRating.value, newComment.value);
      if (!error) {
        ratings.value.unshift(data);
        newRating.value = 5;
        newComment.value = '';
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
      handleSubmit
    };
  }
};
</script>

<style scoped>
/* Add any additional styles here */
</style>
