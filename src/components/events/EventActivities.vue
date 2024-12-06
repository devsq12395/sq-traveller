<template>
  <div class="mb-4">
    <h3 class="text-xl font-semibold text-left mb-5">Things to do:</h3>
    <ul>
      <li v-for="activity in activities" :key="activity.id" class="flex items-center">
        <span>- {{ activity.todo }}</span>
      </li>
    </ul>
    <button v-if="isOwner" @click="$emit('show-add-todo')" class="mt-2 p-2 bg-green-500 text-white rounded">Add</button>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { updateActivityStatus } from '../../helpers/activities';
import { fetchEventTodos, addTodo } from '../../helpers/todo';

export default {
  name: 'EventActivities',
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
    const activities = ref([]);

    const loadActivities = async () => {
      const { data } = await fetchEventTodos(props.eventId);
      activities.value = data;
    };

    const updateActivity = async (activity) => {
      await updateActivityStatus(activity.id, activity.is_checked);
    };

    const addNewTodo = async (todoContent) => {
      const { error } = await addTodo(props.eventId, todoContent);
      if (!error) {
        loadActivities(); // Refresh the list after adding
      } else {
        console.error('Error adding todo');
      }
    };

    watch(() => props.eventId, {
      immediate: true,
      handler(newEventId) {
        if (newEventId) {
          loadActivities();
        }
      },
    });

    onMounted(loadActivities);

    return {
      activities,
      updateActivity,
      addNewTodo,
    };
  },
};
</script>

<style scoped>
/* Additional styles if needed */
</style>
