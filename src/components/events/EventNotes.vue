<template>
  <div class="mb-4">
    <div class="flex justify-between items-center mb-5">
      <h3 class="text-xl font-semibold text-left">Event Notes:</h3>
      <button v-if="isOwner" @click="$emit('show-add-note')" class="p-2 bg-green-500 text-white rounded">Add Note</button>
    </div>
    <ul>
      <li v-for="note in notes" :key="note.id" class="flex items-center">
        <button v-if="isOwner" @click="removeNote(note.id)" class="p-1 text-red-500 rounded mr-2">
          <span class="material-icons">delete</span>
        </button>
        <span>- {{ note.note }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { deleteNote } from '../../helpers/notes';

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
  },
  methods: {
    async removeNote(noteId) {
      const { error } = await deleteNote(noteId);
      if (!error) {
        window.location.reload();
      } else {
        console.error('Error deleting note');
      }
    }
  }
};
</script>

<style scoped>
/* Additional styles if needed */
</style>
