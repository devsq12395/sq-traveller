<template>
  <div>
    <form @submit.prevent="handleLogin" class="flex flex-col space-y-4">
      <!-- Email Input -->
      <input 
        type="email" 
        v-model="email" 
        placeholder="Email" 
        required 
        class="p-3 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
      />
      <!-- Password Input -->
      <input 
        type="password" 
        v-model="password" 
        placeholder="Password" 
        required 
        class="p-3 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
      />
      <!-- Login Button -->
      <button type="submit" class="p-3 bg-indigo-500 text-white rounded hover:bg-indigo-600">
        Login
      </button>
      <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import { login } from '../../helpers/authService';

export default {
  name: 'UserLogin',
  data() {
    return {
      email: '',
      password: '',
      errorMessage: null,
    };
  },
  methods: {
    async handleLogin() {
      const error = await login(this.email, this.password);
      if (error) {
        this.errorMessage = error.message;
      } else {
        this.errorMessage = null;
        this.$router.push('/dashboard');
      }
    },
  },
};
</script>

<style scoped>
/* Additional styles if needed */
</style>
