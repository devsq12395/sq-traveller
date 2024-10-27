<template>
  <div>
    <form @submit.prevent="handleSignup" class="flex flex-col space-y-4">
      <!-- Username Input -->
      <input 
        type="text" 
        v-model="username" 
        placeholder="Username" 
        required 
        class="p-3 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
      />
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
      <!-- Signup Button -->
      <button type="submit" class="p-3 bg-indigo-500 text-white rounded hover:bg-indigo-600">
        Sign Up
      </button>
      <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
    </form>

    <p v-if="signupMessage" class="text-green-500 mt-4">{{ signupMessage }}</p>
  </div>
</template>

<script>
import { signup } from '../../helpers/authService';

export default {
  name: 'UserSignup',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      errorMessage: null,
      signupMessage: null,
    };
  },
  methods: {
    async handleSignup() {
      const error = await signup(this.username, this.email, this.password);
      if (error) {
        this.errorMessage = error.message;
      } else {
        this.errorMessage = null;
        this.signupMessage = 'A confirmation email has been sent. Please verify your email before logging in.';
      }
    },
  },
};
</script>

<style scoped>
/* Additional styles if needed */
</style>
