<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="handleClose">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl">
      <!-- Close button -->
      <div class="flex justify-end p-2">
        <button @click="handleClose" class="text-gray-500 hover:text-gray-700">
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
          <UserSignup @signup-success="handleSignupSuccess" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { nextTick } from 'vue';
import UserLogin from './UserLogin.vue';
import UserSignup from './UserSignup.vue';
import { setLoginPopupShow } from '../../context/UserContext';

export default {
  name: 'LoginPopup',
  components: {
    UserLogin,
    UserSignup,
  },
  setup(props, { emit }) {
    const router = useRouter();

    const handleClose = () => {
      console.log('Closing popup');
      setLoginPopupShow(false);
      emit('close');
    };

    const handleLoginSuccess = async () => {
      console.log('Login success');
      // Ensure state updates are processed before closing popup
      await nextTick();
      handleClose();
      // Only navigate if we're not already on the dashboard
      if (router.currentRoute.value.path !== '/dashboard') {
        router.push('/dashboard');
      }
    };

    const handleSignupSuccess = () => {
      console.log('Signup success');
    };

    return {
      handleClose,
      handleLoginSuccess,
      handleSignupSuccess
    };
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
