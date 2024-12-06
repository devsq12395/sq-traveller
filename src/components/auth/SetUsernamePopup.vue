<template>
  <div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div class="bg-white p-6 rounded shadow-lg w-[400px]">
      <h2 class="text-2xl font-bold mb-4">Set Your Username</h2>
      <form @submit.prevent="handleSetUsername">
        <input v-model="username" type="text" placeholder="Enter your username" class="w-full p-2 border border-gray-300 rounded mb-4" required />
        <button type="submit" class="p-2 bg-blue-500 text-white rounded w-full">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { createProfile } from '../../helpers/authService'; // Assume this function creates a profile

export default {
  name: 'SetUsernamePopup',
  setup(props, { emit }) {
    const username = ref('');

    const handleSetUsername = async () => {
      const { error } = await createProfile(username.value);
      if (!error) {
        emit('close');
      } else {
        console.error('Error setting username:', error.message);
      }
    };

    return {
      username,
      handleSetUsername,
    };
  },
};
</script>

<style scoped>
/* Add any additional styles if needed */
</style>
