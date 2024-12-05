<template>
  <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
    <div class="flex justify-between items-start">
      <div class="text-left">
        <span class="font-semibold text-gray-800">{{ comment.profile.username }}</span>
        <span class="text-sm text-gray-500 ml-2">{{ formattedDate }}</span>
      </div>
      <button 
        v-if="canDelete" 
        @click="handleDelete"
        class="text-red-500 hover:text-red-600"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
    <p class="mt-2 text-gray-700 text-left">{{ comment.comment }}</p>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useUser } from '../../context/UserContext';
import { deleteComment } from '../../helpers/itineraryComments';

export default {
  name: 'ItineraryComment',
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  emits: ['deleted'],
  setup(props, { emit }) {
    const userState = useUser();

    const formattedDate = computed(() => {
      const date = new Date(props.comment.created_at);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    });

    const canDelete = computed(() => {
      return userState.user_id === props.comment.user_id;
    });

    const handleDelete = async () => {
      const { error } = await deleteComment(props.comment.id, userState.user_id);
      if (!error) {
        emit('deleted', props.comment.id);
      }
    };

    return {
      formattedDate,
      canDelete,
      handleDelete
    };
  }
};
</script>
