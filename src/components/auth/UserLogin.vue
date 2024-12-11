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
      <button 
        type="submit" 
        :disabled="disabledButton" 
        class="p-3 rounded w-full"
        :class="disabledButton ? 'bg-gray-300 cursor-not-allowed text-gray-700' : 'bg-indigo-500 hover:bg-indigo-600 text-white'"
      >
        Login
      </button>
      <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { login } from '../../helpers/authService';

export default {
  name: 'UserLogin',
  emits: ['login-success'],
  props: {
    disabledButton: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const email = ref('');
    const password = ref('');
    const errorMessage = ref(null);

    const handleLogin = async () => {
      const error = await login(email.value, password.value);
      if (error) {
        errorMessage.value = error.message;
      } else {
        errorMessage.value = null;
        emit('login-success');
      }
    };

    return {
      email,
      password,
      errorMessage,
      handleLogin
    };
  }
};
</script>

<style scoped>
/* Additional styles if needed */
</style>
