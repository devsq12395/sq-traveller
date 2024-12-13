<template>
  <div class="mb-4">
    <div class="flex justify-between items-center mb-5">
      <h3 class="text-xl font-semibold text-left">Event Notes:</h3>
      <button v-if="isOwner" @click="$emit('add-note')" class="p-2 bg-green-500 text-white rounded">Add Note</button>
    </div>
    <ul>
      <li v-for="note in notes" :key="note.id" class="text-left">
        - {{ note.note }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'EventNotes',
  props: {
    notes: {
      type: Array,
      default: () => []
    },
    isOwner: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped>
/* Additional styles if needed */
</style>
