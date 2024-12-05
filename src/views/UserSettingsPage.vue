<template>
  <div class="min-h-screen p-8 pt-20 bg-gray-100">
    <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div class="flex items-center mb-6">
        <button
          @click="goBack"
          class="p-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 mr-4"
        >
          ← Back
        </button>
        <h1 class="text-3xl font-bold">User Settings</h1>
      </div>

      <!-- Settings content will go here -->
      <div class="space-y-6">
        <p class="text-gray-600">Settings content coming soon...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  name: 'UserSettingsPage',
  setup() {
    const router = useRouter();

    const goBack = () => {
      router.back();
    };

    return {
      goBack
    };
  }
};
</script>
