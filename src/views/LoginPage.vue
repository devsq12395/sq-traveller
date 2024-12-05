<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-100">
    <div class="w-full max-w-4xl flex bg-white shadow-lg rounded-lg overflow-hidden">
      <!-- Login Section -->
      <div class="w-1/2 p-8">
        <h2 class="text-2xl font-bold mb-6">Login</h2>
        <UserLogin />
      </div>
      
      <!-- Signup Section -->
      <div class="w-1/2 p-8 bg-gray-50">
        <h2 class="text-2xl font-bold mb-6">Sign Up</h2>
        <UserSignup />
      </div>
    </div>
  </div>
</template>

<script>
import UserLogin from '../components/auth/UserLogin.vue';
import UserSignup from '../components/auth/UserSignup.vue';

export default {
  name: 'LoginPage',
  components: {
    UserLogin,
    UserSignup,
  },
};
</script>

<style scoped>
/* Additional styles if needed */
</style>
