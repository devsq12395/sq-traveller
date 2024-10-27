<template>
  <div class="min-h-screen flex flex-col items-center justify-center">
    <h1 class="text-3xl font-bold">Hello World</h1>
    <button @click="handleLogout" class="mt-4 p-3 bg-red-500 text-white rounded hover:bg-red-600">
      Logout
    </button>
  </div>
</template>

<script>
import { logout } from '../helpers/authService';

export default {
  name: 'HomePage',
  methods: {
    async handleLogout() {
      const error = await logout();
      if (!error) {
        this.$router.push('/'); // Redirect to login page after logout
      }
    },
  },
};
</script>

<style scoped>
/* Additional styles if needed */
</style>
