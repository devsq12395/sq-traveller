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
      <button 
        type="submit" 
        :disabled="disabledButton" 
        class="p-3 rounded w-full"
        :class="disabledButton ? 'bg-gray-300 cursor-not-allowed text-gray-700' : 'bg-indigo-500 hover:bg-indigo-600 text-white'"
      >
        Sign Up
      </button>
      <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
      <p v-if="successMessage" class="text-green-500">{{ successMessage }}</p>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { signup } from '../../helpers/authService';

export default {
  name: 'UserSignup',
  emits: ['signup-success'],
  props: {
    disabledButton: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const username = ref('');
    const email = ref('');
    const password = ref('');
    const errorMessage = ref(null);
    const successMessage = ref(null);

    const handleSignup = async () => {
      const result = await signup(email.value, password.value, username.value);
      if (result.error) {
        errorMessage.value = result.error.message;
        successMessage.value = null;
      } else {
        errorMessage.value = null;
        successMessage.value = `${result.data.message}`;
        emit('signup-success');
      }
    };

    return {
      username,
      email,
      password,
      errorMessage,
      successMessage,
      handleSignup
    };
  }
};
</script>

<style scoped>
/* Additional styles if needed */
</style>
