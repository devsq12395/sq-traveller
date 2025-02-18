<template>
  <div v-if="isShow" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-40">
    <div class="bg-white p-6 rounded shadow-lg w-96">
      <h2 class="text-2xl font-bold mb-4">Add To-Do</h2>
  
      <form @submit.prevent="handleAddTodo" class="space-y-4">
        <!-- To-Do Input Field -->
        <div class="grid grid-cols-3 items-start gap-2">
          <label for="todo" class="text-gray-700 font-semibold text-left">To-Do:</label>
          <textarea
            id="todo"
            v-model="todoContent"
            placeholder="Enter your to-do item"
            required
            maxlength="200"
            class="col-span-2 p-2 border border-gray-300 rounded"
          ></textarea>
          <p class="col-span-3 text-right text-sm text-gray-500">{{ todoContent.length }}/200</p>
        </div>
  
        <!-- Action Buttons -->
        <div class="flex justify-end space-x-2">
          <button type="button" @click="closePopup" class="p-2 bg-gray-300 rounded">Cancel</button>
          <button type="submit" class="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">Add To-Do</button>
        </div>
      </form>
    </div>
  </div>
</template>
  
<script>
import { ref, watch } from 'vue';
import { addTodo } from '../../helpers/todo';
import { eventPopupsState, setCreateTodoPopupShow, useEvent } from '../../context/UserContext';
  
export default {
  name: 'CreateTodoPopup',
  emits: ['close', 'refresh'],
  setup(_, { emit }) {
    const { eventId } = useEvent(); // Use eventId from context
    const todoContent = ref('');
    const isShow = ref(eventPopupsState.isCreateTodoPopupShow);

    // Watch for changes in isCreateTodoPopupShow
    watch(() => eventPopupsState.isCreateTodoPopupShow, (newVal) => {
      isShow.value = newVal;
    });

    // Handle adding the to-do
    const handleAddTodo = async () => {
      const { error } = await addTodo(eventPopupsState.eventId, todoContent.value);

      if (!error) {
        emit('refresh'); // Emit refresh event to reload to-dos
        closePopup();
      } else {
        console.error('Error adding to-do:', error.message);
      }
    };

    const closePopup = () => {
      todoContent.value = '';
      setCreateTodoPopupShow(eventId, false);
    };

    return {
      todoContent,
      handleAddTodo,
      closePopup,
      isShow,
    };
  },
};
</script>
  
<style scoped>
/* Optional styles */
</style>
