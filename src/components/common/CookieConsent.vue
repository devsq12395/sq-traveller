<template>
  <div class="fixed bottom-0 w-full bg-indigo-900 bg-opacity-90 text-white py-6 shadow-lg z-150" v-if="show">
    <div class="max-w-3xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
      <div class="text-left">
        <h2 class="text-xl font-bold">Cookie Preferences</h2>
        <p class="mt-3">We use cookies to enhance your browsing experience and provide personalized content. For more details, read our <a href="https://www.privacypolicies.com/live/287ad8f0-9a3b-47c5-9bce-8d71f0e37e9c" class="text-yellow-400 underline">privacy policy</a>.</p>
      </div>
      <div class="flex space-x-3 mt-4 md:mt-0">
        <button @click="acceptAll" class="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">Accept All</button>
        <button @click="rejectAll" class="bg-gray-400 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-500">Reject All</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useCookies, setCookies } from '../../context/UserContext';
import { ref } from 'vue';

export default {
  name: 'CookieConsent',
  setup() {
    const cookies = useCookies();
    const show = ref(true);

    const acceptAll = () => {
      setCookies({ necessary: true, analytics: true, preferences: true });
      cookies.analytics = true;
      cookies.preferences = true;
      show.value = false;
    };

    const rejectAll = () => {
      setCookies({ necessary: true, analytics: false, preferences: false });
      cookies.analytics = false;
      cookies.preferences = false;
      show.value = false;
    };

    return {
      cookies,
      show,
      acceptAll,
      rejectAll,
    };
  },
};
</script>

<style scoped>
.fixed {
  z-index: 200;
}
/* Tailwind CSS styles applied directly in the template */
</style>
