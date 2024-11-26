<template>
  <div class="mb-4">
    <h3 class="text-xl font-semibold">Budget:</h3>
    <ul>
      <li v-for="budget in budgets" :key="budget.id" class="flex justify-between">
        <span>{{ budget.budget_name }}</span>
        <span>${{ budget.budget_price.toFixed(2) }}</span>
      </li>
    </ul>
    <hr class="my-2 border-gray-700">
    <div class="flex justify-between font-bold">
      <span>Total:</span>
      <span>${{ totalBudget.toFixed(2) }}</span>
    </div>
    <button v-if="isOwner" @click="$emit('show-add-budget')" class="mt-2 p-2 bg-green-500 text-white rounded">Add</button>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { fetchEventBudgets } from '../../helpers/budgets';

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

    const loadBudgets = async () => {
      const { data } = await fetchEventBudgets(props.eventId);
      budgets.value = data;
    };

    const totalBudget = computed(() => budgets.value.reduce((acc, budget) => acc + budget.budget_price, 0));

    onMounted(loadBudgets);

    return {
      budgets,
      totalBudget
    };
  },
};
</script>

<style scoped>
/* Additional styles if needed */
</style>
