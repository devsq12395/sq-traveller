<template>
  <div v-if="eventPopupsState.isCreateBudgetPopupShow" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded shadow-lg w-96">
      <h2 class="text-2xl font-bold mb-4">Add Budget</h2>

      <form @submit.prevent="handleAddBudget" class="space-y-4">
        <!-- Budget Name Input Field -->
        <div class="grid grid-cols-3 items-start gap-2">
          <label for="budget_name" class="text-gray-700 font-semibold text-left">Budget Name:</label>
          <input
            type="text"
            id="budget_name"
            v-model="budgetName"
            placeholder="Enter budget name"
            required
            class="col-span-2 p-2 border border-gray-300 rounded"
          />
        </div>

        <!-- Budget Price Input Field -->
        <div class="grid grid-cols-3 items-start gap-2">
          <label for="budget_price" class="text-gray-700 font-semibold text-left">Price:</label>
          <input
            type="number"
            id="budget_price"
            v-model="budgetPrice"
            placeholder="Enter budget price"
            required
            class="col-span-2 p-2 border border-gray-300 rounded"
          />
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-2">
          <button type="button" @click="closePopup" class="p-2 bg-gray-300 rounded">Cancel</button>
          <button type="submit" class="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">Add Budget</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { addBudget } from '../../helpers/budgets';
import { eventPopupsState, useEvent } from '../../context/UserContext';

export default {
  name: 'CreateBudgetPopup',
  emits: ['close', 'refresh'],
  setup(_, { emit }) {
    const { eventId } = useEvent(); // Use eventId from context
    const budgetName = ref('');
    const budgetPrice = ref(0);

    // Handle adding the budget
    const handleAddBudget = async () => {
      const { error } = await addBudget(eventId, budgetName.value, budgetPrice.value);

      if (!error) {
        emit('refresh'); // Emit refresh event to reload budgets
        closePopup();
      } else {
        console.error('Error adding budget:', error.message);
      }
    };

    const closePopup = () => {
      emit('close');
    };

    return {
      budgetName,
      budgetPrice,
      handleAddBudget,
      closePopup,
    };
  },
};
</script>

<style scoped>
/* Optional styles */
</style>
