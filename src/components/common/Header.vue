<template>
  <div class="fixed top-0 left-0 right-0 z-50 header flex justify-between items-center px-6 py-4 bg-white shadow-md">
    <div>
      <router-link to="/" class="text-xl font-bold text-gray-800">SQ Traveller</router-link>
    </div>
    <div>
      <span v-if="userState.username" class="text-gray-800 font-semibold">Welcome, {{ userState.username }}</span>
      <router-link v-else to="/" class="text-blue-500 font-semibold hover:text-blue-600">Login</router-link>
    </div>
  </div>
</template>

<script>
import { useUser } from '../../context/UserContext';

export default {
  name: 'HeaderComponent',
  setup() {
    const userState = useUser();

    return {
      userState
    };
  },
};
</script>

<style scoped>
.header {
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(5px);
}
</style>
