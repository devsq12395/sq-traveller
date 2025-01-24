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

      <div class="settings-page mx-auto p-6 max-w-4xl">
        <h1 class="text-3xl font-bold mb-6">User Settings</h1>

        <div class="space-y-6">
          <!-- Change Username -->
          <div class="bg-white p-4 rounded shadow">
            <h2 class="text-xl font-semibold mb-2">Change Username</h2>
            <input type="text" placeholder="Enter new username" class="w-full p-2 border border-gray-300 rounded" />
            <button class="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Save Username</button>
          </div>

          <!-- Change Avatar -->
          <div class="bg-white p-4 rounded shadow">
            <h2 class="text-xl font-semibold mb-2">Change Avatar</h2>
            <div class="flex items-center space-x-4">
              <img src="https://via.placeholder.com/100" alt="Current Avatar" class="w-24 h-24 rounded-full" />
              <input type="file" class="border border-gray-300 rounded" />
            </div>
            <button class="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Upload Avatar</button>
          </div>

          <!-- Change Banner -->
          <div class="bg-white p-4 rounded shadow">
            <h2 class="text-xl font-semibold mb-2">Change Banner</h2>
            <div class="flex items-center space-x-4">
              <img src="https://via.placeholder.com/300x100" alt="Current Banner" class="w-full h-24 object-cover rounded" />
              <input type="file" class="border border-gray-300 rounded" />
            </div>
            <button class="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Upload Banner</button>
          </div>
        </div>
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

<style scoped>
.settings-page {
  background-color: #f7fafc;
  min-height: 100vh;
}
</style>
