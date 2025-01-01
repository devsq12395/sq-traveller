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
        <div class="flex-col w-full">
          <!-- Tabs Section -->
          <div class="flex border-b border-gray-300">
            <button
              v-for="tab in tabs"
              :key="tab"
              @click="currentTab = tab"
              :class="{
                'border-b-2 border-blue-500 text-blue-600': currentTab === tab,
                'hover:text-blue-500': true
              }"
              class="flex-1 px-6 py-2 text-center text-sm font-medium text-gray-600"
            >
              {{ tab }}
            </button>
          </div>

          <!-- Login Section -->
          <div v-if="currentTab === 'Login'" class="w-full p-6">
            <h2 class="text-2xl font-bold mb-6">Login</h2>
            <UserLogin @login-success="handleLoginSuccess" :disabledButton="!isTermsChecked" />

            <!-- Other login options -->
            <div class="flex items-center justify-center">
              <button 
                @click="handleGoogleLogin" 
                class="p-3 text-white rounded mt-4 w-1/10 flex justify-center items-center"
                :class="isTermsChecked ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-300 cursor-not-allowed'"
                :disabled="!isTermsChecked"
              >
                <i class="fab fa-google text-xl"></i> <!-- Google icon -->
              </button>
            </div>

            <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>
            <SetUsernamePopup v-if="showSetUsernamePopup" @close="showSetUsernamePopup = false" />
          </div>
          
          <!-- Signup Section -->
          <div v-else-if="currentTab === 'Signup'" class="w-full p-6 bg-gray-50">
            <h2 class="text-2xl font-bold mb-6">Sign Up</h2>
            <UserSignup @signup-success="handleSignupSuccess" :disabledButton="!isTermsChecked" />
          </div>

          <!-- Checkbox Section -->
          <div class="mt-4 mb-2 p-6 pt-0 flex justify-center">
            <label class="flex items-center space-x-2">
              <input type="checkbox" v-model="isTermsChecked" />
              <span class="text-sm">
                To login/signup, you must agree to the <a href="https://docs.google.com/document/d/1En846DT-jYKjaPseW-rmuS69F4wAX74z7HMT85seLEg/edit?tab=t.0#heading=h.unu1of39qmba" class="text-blue-500 underline">Terms and Conditions</a>
              </span>
            </label>
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

    const tabs = ['Login', 'Signup'];
    const currentTab = ref('Login');

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
      tabs,
      currentTab,
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
