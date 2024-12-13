<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="handleClose">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl">
      <!-- Close button -->
      <div class="flex justify-end p-2">
        <button @click="handleClose" class="text-gray-500 hover:text-gray-700">
          <span class="text-2xl">&times;</span>
        </button>
      </div>

      <div class="flex flex-col items-center">
        <!-- Checkbox Section -->
        <div class="mt-4 mb-2">
          <label class="flex items-center space-x-2">
            <input type="checkbox" v-model="isTermsChecked" />
            <span class="text-sm">
              I agree to the <a href="https://docs.google.com/document/d/1En846DT-jYKjaPseW-rmuS69F4wAX74z7HMT85seLEg/edit?tab=t.0#heading=h.unu1of39qmba" class="text-blue-500 underline">Terms and Conditions</a>
            </span>
          </label>
        </div>

        <div class="flex w-full">
          <!-- Login Section -->
          <div class="w-1/2 p-6">
            <h2 class="text-2xl font-bold mb-6">Login</h2>
            <UserLogin @login-success="handleLoginSuccess" :disabledButton="!isTermsChecked" />
            <button 
              @click="handleGoogleLogin" 
              class="p-3 text-white rounded mt-4 w-full"
              :class="isTermsChecked ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-300 cursor-not-allowed'"
              :disabled="!isTermsChecked"
            >
              Login with Google
            </button>
            <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
            <SetUsernamePopup v-if="showSetUsernamePopup" @close="showSetUsernamePopup = false" />
          </div>
          
          <!-- Signup Section -->
          <div class="w-1/2 p-6 bg-gray-50">
            <h2 class="text-2xl font-bold mb-6">Sign Up</h2>
            <UserSignup @signup-success="handleSignupSuccess" :disabledButton="!isTermsChecked" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { nextTick, ref } from 'vue';
import UserLogin from './UserLogin.vue';
import UserSignup from './UserSignup.vue';
import { setLoginPopupShow } from '../../context/UserContext';
import { loginWithGoogle } from '../../helpers/authService';
import SetUsernamePopup from './SetUsernamePopup.vue';

export default {
  name: 'LoginPopup',
  components: {
    UserLogin,
    UserSignup,
    SetUsernamePopup,
  },
  setup(props, { emit }) {
    const router = useRouter();
    const errorMessage = ref(null);
    const showSetUsernamePopup = ref(false);
    const isTermsChecked = ref(false);

    const handleClose = () => {
      setLoginPopupShow(false);
      emit('close');
    };

    const handleLoginSuccess = async () => {
      await nextTick();
      handleClose();
      if (router.currentRoute.value.path !== '/dashboard') {
        router.push('/dashboard');
      }
    };

    const handleGoogleLogin = async () => {
      if (!isTermsChecked.value) {
        errorMessage.value = 'You must agree to the Terms and Conditions.';
        return;
      }
      const { data, error } = await loginWithGoogle();
      if (error) {
        errorMessage.value = error.message;
      } else if (data) {
        window.location.href = data.url;
      }
    };

    return {
      handleClose,
      handleLoginSuccess,
      handleGoogleLogin,
      errorMessage,
      showSetUsernamePopup,
      isTermsChecked,
    };
  },
  emits: ['close'],
};
</script>

<style scoped>
/* Prevent body scrolling when popup is open */
:deep(body.popup-open) {
  overflow: hidden;
}
</style>
