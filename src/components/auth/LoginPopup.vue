<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="$emit('close')">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl">
      <!-- Close button -->
      <div class="flex justify-end p-2">
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <span class="text-2xl">&times;</span>
        </button>
      </div>

      <div class="flex">
        <!-- Login Section -->
        <div class="w-1/2 p-6">
          <h2 class="text-2xl font-bold mb-6">Login</h2>
          <UserLogin @login-success="handleLoginSuccess" />
        </div>
        
        <!-- Signup Section -->
        <div class="w-1/2 p-6 bg-gray-50">
          <h2 class="text-2xl font-bold mb-6">Sign Up</h2>
          <UserSignup @signup-success="handleLoginSuccess" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import UserLogin from './UserLogin.vue';
import UserSignup from './UserSignup.vue';

export default {
  name: 'LoginPopup',
  components: {
    UserLogin,
    UserSignup,
  },
  methods: {
    handleLoginSuccess() {
      this.$emit('close');
      this.$router.push('/dashboard');
    }
  },
  emits: ['close']
};
</script>

<style scoped>
/* Prevent body scrolling when popup is open */
:deep(body.popup-open) {
  overflow: hidden;
}
</style>
