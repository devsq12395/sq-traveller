<template>
  <div class="space-y-4">
    <template v-if="ratings.length > 0">
      <div v-for="rating in ratings" :key="rating.id" class="border rounded-lg p-4 bg-white shadow text-left">
        <p class="text-lg font-semibold">{{ rating.profile?.username || 'Unknown User' }}</p>
        <div class="flex justify-between items-start">
          <div class="flex space-x-1">
            <span v-for="star in 5" :key="star" class="cursor-pointer">
              <svg
                :class="rating.rating >= star ? 'text-yellow-500' : 'text-gray-300'"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
                class="w-5 h-5"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.982a1 1 0 00.95.69h4.184c.969 0 1.371 1.24.588 1.81l-3.392 2.466a1 1 0 00-.364 1.118l1.286 3.982c.3.921-.755 1.688-1.54 1.118l-3.392-2.466a1 1 0 00-1.175 0l-3.392 2.466c-.784.57-1.839-.197-1.54-1.118l1.286-3.982a1 1 0 00-.364-1.118L2.83 9.409c-.784-.57-.38-1.81.588-1.81h4.184a1 1 0 00.95-.69l1.286-3.982z" />
              </svg>
            </span>
          </div>
          <div v-if="rating.user_id === currentUser.id" class="flex space-x-2">
            <button class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600" @click="$emit('edit-rating', rating)">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600" @click="$emit('delete-rating', rating.id)">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>
        <p class="text-gray-600">{{ rating.comment }}</p>
        <p class="text-gray-500 text-sm">Rated on: {{ new Date(rating.created_at).toLocaleDateString() }}</p>
      </div>
    </template>
    <div v-else class="text-center py-8 text-gray-500">
      No ratings yet. Be the first to rate!
    </div>
  </div>
</template>

<script>
export default {
  props: {
    ratings: {
      type: Array,
      required: true
    },
    currentUser: {
      type: Object,
      required: true
    }
  }
};
</script>

<style scoped>
/* Add any additional styles here */
</style>
