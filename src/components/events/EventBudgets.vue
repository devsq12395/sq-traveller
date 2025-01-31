<template>
  <div class="mb-4">
    <div class="flex justify-between items-center mb-5">
      <h3 class="text-xl font-semibold text-left">Budget:</h3>
      <button v-if="isOwner" @click="$emit('show-add-budget')" class="p-2 bg-green-500 text-white rounded">Add Budget</button>
    </div>
    <ul>
      <li v-for="budget in budgets" :key="budget.id" class="flex justify-between">
        <div class="flex items-start">
          <button v-if="isOwner" @click="removeBudget(budget.id)" class="p-1 text-red-500 rounded mr-2">
            <span class="material-icons">delete</span>
          </button>
          <span>{{ budget.budget_name }}</span>
        </div>
        <span>${{ budget.budget_price.toFixed(2) }}</span>
      </li>
    </ul>
    <hr class="my-2 border-gray-700">
    <div class="flex justify-between font-bold">
      <span>Total:</span>
      <span>${{ totalBudget.toFixed(2) }}</span>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted, computed } from 'vue';
import { fetchEventBudgets, deleteBudget } from '../../helpers/budgets';
import { useItinerary } from '../../context/UserContext';

export default {
  name: 'EventBudgets',
  props: {
    eventId: {
      type: String,
      required: true,
    },
    isOwner: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const budgets = ref([]);
    const itineraryState = useItinerary();

    const loadBudgets = async () => {
      const { data } = await fetchEventBudgets(props.eventId);
      budgets.value = data;
    };

    const totalBudget = computed(() => budgets.value.reduce((acc, budget) => acc + budget.budget_price, 0));

    const removeBudget = async (budgetId) => {
      const { error } = await deleteBudget(budgetId);
      if (!error) {
        loadBudgets(); // Refresh the list after deletion
      } else {
        console.error('Error deleting budget item');
      }
    };

    onMounted(loadBudgets);

    watch(() => itineraryState.lastRefresh, (newVal, oldVal) => {
      if (newVal !== oldVal) {
        loadBudgets();
      }
    }, { immediate: true });

    return {
      budgets,
      totalBudget,
      removeBudget
    };
  }
};
</script>

<style scoped>
/* Additional styles if needed */
</style>
