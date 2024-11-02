<template>
  <div class="mb-4">
    <h3 class="text-xl font-semibold">Things to do:</h3>
    <ul>
      <li v-for="activity in activities" :key="activity.id" class="flex items-center">
        <input
          type="checkbox"
          v-model="activity.is_checked"
          @change="updateActivity(activity)"
          class="mr-2"
        />
        <span>{{ activity.activity_name }}</span>
      </li>
    </ul>
    <button class="mt-2 p-2 bg-green-500 text-white rounded">Add</button>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { fetchEventActivities, updateActivityStatus } from '../../helpers/activities';

export default {
  name: 'EventActivities',
  props: {
    eventId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const activities = ref([]);

    const loadActivities = async () => {
      const { data } = await fetchEventActivities(props.eventId);
      activities.value = data;
    };

    const updateActivity = async (activity) => {
      await updateActivityStatus(activity.id, activity.is_checked);
    };

    onMounted(loadActivities);

    return {
      activities,
      updateActivity,
    };
  },
};
</script>

<style scoped>
/* Additional styles if needed */
</style>
