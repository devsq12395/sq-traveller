<template>
    <div v-if="isShow" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-40">
      <div class="bg-white p-6 rounded shadow-lg w-96">
        <h2 class="text-2xl font-bold mb-4">Add Note</h2>
  
        <form @submit.prevent="handleAddNote" class="space-y-4">
          <!-- Note Input Field -->
          <div class="grid grid-cols-3 items-start gap-2">
            <label for="note" class="text-gray-700 font-semibold text-left">Note:</label>
            <textarea
              id="note"
              v-model="noteContent"
              placeholder="Enter your note"
              required
              class="col-span-2 p-2 border border-gray-300 rounded"
            ></textarea>
          </div>
  
          <!-- Action Buttons -->
          <div class="flex justify-end space-x-2">
            <button type="button" @click="closePopup" class="p-2 bg-gray-300 rounded">Cancel</button>
            <button type="submit" class="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">Add Note</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, watch } from 'vue';
  import { addNote } from '../../helpers/notes';
  import { eventPopupsState, setCreateNotePopupShow, useEvent } from '../../context/UserContext';
  
  export default {
    name: 'CreateNotePopup',
    emits: ['close', 'refresh'],
    setup(_, { emit }) {
      const { eventId } = useEvent(); // Use eventId from context
      const noteContent = ref('');
      const isShow = ref(eventPopupsState.isCreateNotePopupShow);

      watch(() => eventPopupsState.isCreateNotePopupShow, (newVal) => {
        isShow.value = newVal;
      });
  
      // Handle adding the note
      const handleAddNote = async () => {
        const { error } = await addNote(eventPopupsState.eventId, noteContent.value);
  
        if (!error) {
          emit('refresh'); // Emit refresh event to reload notes
          closePopup();
        } else {
          console.error('Error adding note:', error.message);
        }
      };
  
      // Close the popup
      const closePopup = () => {
        noteContent.value = '';
        setCreateNotePopupShow(eventId, false);
      };
  
      return {
        noteContent,
        handleAddNote,
        closePopup,
        isShow,
      };
    },
  };
  </script>
  
  <style scoped>
  /* Optional styles */
  </style>