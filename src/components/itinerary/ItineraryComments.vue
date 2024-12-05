<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Comments</h2>
    
    <!-- Add Comment Form -->
    <div v-if="userState.username" class="mb-6">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <textarea
            v-model="newComment"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50"
            placeholder="Add a comment..."
            required
          ></textarea>
        </div>
        <div class="flex justify-end">
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? 'Posting...' : 'Post Comment' }}
          </button>
        </div>
      </form>
    </div>
    <div v-else class="mb-6 p-4 bg-gray-50 rounded-lg text-center">
      <p class="text-gray-600">Please log in to add comments.</p>
    </div>

    <!-- Comments List -->
    <div class="space-y-4">
      <template v-if="comments.length > 0">
        <ItineraryComment
          v-for="comment in comments"
          :key="comment.id"
          :comment="comment"
          @deleted="handleCommentDeleted"
        />
      </template>
      <div v-else class="text-center py-8 text-gray-500">
        No comments yet. Be the first to comment!
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useUser } from '../../context/UserContext';
import { fetchComments, addComment } from '../../helpers/itineraryComments';
import ItineraryComment from './ItineraryComment.vue';

export default {
  name: 'ItineraryComments',
  components: {
    ItineraryComment
  },
  props: {
    itineraryId: {
      type: String,
      required: true
    }
  },
  emits: ['update:commentCount'],
  setup(props, { emit }) {
    const userState = useUser();
    const comments = ref([]);
    const newComment = ref('');
    const isSubmitting = ref(false);

    const loadComments = async () => {
      const { data, error } = await fetchComments(props.itineraryId);
      if (!error && data) {
        comments.value = data;
        emit('update:commentCount', data.length);
      }
    };

    const handleSubmit = async () => {
      if (!newComment.value.trim()) return;
      
      isSubmitting.value = true;
      const { data, error } = await addComment(
        props.itineraryId,
        userState.user_id,
        newComment.value.trim()
      );

      if (!error && data) {
        comments.value.unshift(data);
        newComment.value = '';
        emit('update:commentCount', comments.value.length);
      }
      isSubmitting.value = false;
    };

    const handleCommentDeleted = (commentId) => {
      comments.value = comments.value.filter(comment => comment.id !== commentId);
      emit('update:commentCount', comments.value.length);
    };

    onMounted(() => {
      loadComments();
    });

    return {
      userState,
      comments,
      newComment,
      isSubmitting,
      handleSubmit,
      handleCommentDeleted
    };
  }
};
</script>
