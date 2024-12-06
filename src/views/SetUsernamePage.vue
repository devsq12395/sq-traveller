<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
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
import { useRouter } from 'vue-router';
import { createProfile } from '../helpers/authService'; // Assume this function creates a profile

export default {
  name: 'SetUsernamePage',
  setup() {
    const router = useRouter();
    const username = ref('');

    const handleSetUsername = async () => {
      const { error } = await createProfile(username.value);
      if (!error) {
        // Redirect to dashboard or another page after setting username
        router.push('/dashboard');
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
