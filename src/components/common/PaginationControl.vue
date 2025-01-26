<template>
  <div class="pagination-control flex items-center justify-center space-x-4">
    <button 
      @click="$emit('previous-page')" 
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      :disabled="currentPage === 1"
    >
      Previous
    </button>
    <span class="text-lg">Page {{ currentPage }} of {{ maxPage }}</span>
    <button 
      @click="$emit('next-page')" 
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      :disabled="currentPage === maxPage"
    >
      Next
    </button>
  </div>
</template>

<script>
export default {
  name: 'PaginationControl',
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    maxPage: {
      type: Number,
      required: true
    }
  }
};
</script>

<style scoped>
</style>