<template>
  <div class="fixed bottom-0 w-full bg-indigo-900 bg-opacity-90 text-white py-6 shadow-lg z-150" v-if="show">
    <div class="max-w-3xl mx-auto text-left">
      <h2 class="text-xl font-bold">Cookie Preferences</h2>
      <p class="mt-3">We use cookies to enhance your browsing experience and provide personalized content. For more details, read our <a href="https://www.privacypolicies.com/live/287ad8f0-9a3b-47c5-9bce-8d71f0e37e9c" class="text-yellow-400 underline">privacy policy</a>.</p>
      <div class="flex justify-start mt-4 space-x-4">
        <button @click="cookies.necessary = !cookies.necessary" class="px-3 py-1 rounded-lg" :class="cookies.necessary ? 'bg-green-500' : 'bg-gray-500'">Necessary</button>
        <button @click="cookies.analytics = !cookies.analytics" class="px-3 py-1 rounded-lg" :class="cookies.analytics ? 'bg-green-500' : 'bg-gray-500'">Analytics</button>
        <button @click="cookies.preferences = !cookies.preferences" class="px-3 py-1 rounded-lg" :class="cookies.preferences ? 'bg-green-500' : 'bg-gray-500'">Preferences</button>
      </div>
      <div class="flex justify-start mt-5 space-x-3">
        <button @click="acceptAll" class="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">Accept All</button>
        <button @click="acceptSelected" class="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700">Accept Selected</button>
        <button @click="rejectAll" class="bg-gray-700 text-white px-5 py-2 rounded-lg hover:bg-gray-800">Reject All</button>
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

    const acceptSelected = () => {
      setCookies(cookies);
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
      acceptSelected,
      rejectAll,
    };
  },
};
</script>

<style scoped>
/* Tailwind CSS styles applied directly in the template */
</style>
