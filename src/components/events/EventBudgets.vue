<template>
  <div class="mb-4">
    <h3 class="text-xl font-semibold">Budget:</h3>
    <ul>
      <li v-for="budget in budgets" :key="budget.id" class="flex justify-between">
        <span>{{ budget.budget_name }}</span>
        <span>${{ budget.budget_price.toFixed(2) }}</span>
      </li>
    </ul>
    <button class="mt-2 p-2 bg-green-500 text-white rounded">Add</button>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { fetchEventBudgets } from '../../helpers/budgets';

export default {
  name: 'EventBudgets',
  props: {
    eventId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const budgets = ref([]);

    const loadBudgets = async () => {
      const { data } = await fetchEventBudgets(props.eventId);
      budgets.value = data;
    };

    onMounted(loadBudgets);

    return {
      budgets,
    };
  },
};
</script>

<style scoped>
/* Additional styles if needed */
</style>
