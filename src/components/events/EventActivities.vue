<template>
  <div class="mb-4">
    <div class="flex justify-between items-center mb-5">
      <h3 class="text-xl font-semibold text-left">Things to do:</h3>
      <button v-if="isOwner" @click="$emit('show-add-todo')" class="p-2 bg-green-500 text-white rounded">Add To-Do</button>
    </div>
    <ul>
      <li v-for="activity in activities" :key="activity.id" class="flex items-center">
        <button v-if="isOwner" @click="removeActivity(activity.id)" class="p-1 text-red-500 rounded mr-2">
          <span class="material-icons">delete</span>
        </button>
        <span>- {{ activity.todo }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { updateActivityStatus } from '../../helpers/activities';
import { fetchEventTodos, addTodo, deleteTodo } from '../../helpers/todo';
import { useItinerary } from '../../context/UserContext';

export default {
  name: 'EventActivities',
  props: {
    lastRefresh: {type: Number, required: true},
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
    const itineraryState = useItinerary();

    const loadActivities = async () => {
      const { data } = await fetchEventTodos(props.eventId);
      activities.value = data;
    };

    const updateActivity = async (activity) => {
      await updateActivityStatus(activity.id, activity.is_checked);
    };

    const removeActivity = async (todoId) => {
      const { error } = await deleteTodo(todoId);
      if (!error) {
        loadActivities(); // Refresh the list after deletion
      } else {
        console.error('Error deleting todo');
      }
    };

    const addNewTodo = async (todoContent) => {
      const { error } = await addTodo(props.eventId, todoContent);
      if (!error) {
        loadActivities(); // Refresh the list after adding
      } else {
        console.error('Error adding todo');
      }
    };

    watch(() => itineraryState.lastRefresh, (newVal, oldVal) => {
      if (newVal !== oldVal) {
        loadActivities();
      }
    }, { immediate: true });

    watch(() => props.lastRefresh, (newVal, oldVal) => {
      if (newVal !== oldVal) {
        loadActivities();
      }
    });

    onMounted(loadActivities);

    return {
      activities,
      updateActivity,
      addNewTodo,
      removeActivity
    };
  },
};
</script>

<style scoped>
/* Additional styles if needed */
</style>
