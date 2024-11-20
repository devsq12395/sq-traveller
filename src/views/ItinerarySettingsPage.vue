<template>
  <div class="min-h-screen p-8 pt-20 bg-gray-100">
    <div class="bg-white rounded-lg shadow-lg p-6">
      <div class="flex items-center mb-6">
        <button
          @click="goBack"
          class="p-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 mr-4"
        >
          ← Back
        </button>
        <h1 class="text-3xl font-bold">Itinerary Settings</h1>
      </div>

      <!-- Settings content -->
      <div class="space-y-6">
        <!-- Privacy Settings -->
        <div class="border-b border-gray-200 pb-6">
          <h2 class="text-xl font-semibold mb-4">Privacy Settings</h2>
          
          <div class="space-y-4">
            <!-- Private Option -->
            <label class="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="privacy"
                value="private"
                v-model="privacySetting"
                class="mt-1"
                @change="updatePrivacy"
              />
              <div>
                <span class="font-medium block">Private</span>
                <span class="text-sm text-gray-500">Only you can see and access this itinerary</span>
              </div>
            </label>

            <!-- Public Option -->
            <label class="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="privacy"
                value="public"
                v-model="privacySetting"
                class="mt-1"
                @change="updatePrivacy"
              />
              <div>
                <span class="font-medium block">Public</span>
                <span class="text-sm text-gray-500">Anyone with the itinerary link can see its contents</span>
              </div>
            </label>

            <!-- Shared Option -->
            <label class="flex items-start space-x-3 cursor-pointer">
              <input
                type="radio"
                name="privacy"
                value="shared"
                v-model="privacySetting"
                class="mt-1"
                @change="updatePrivacy"
              />
              <div>
                <span class="font-medium block">Shared</span>
                <span class="text-sm text-gray-500">
                  Anyone with the itinerary link can see its contents, and this itinerary will be shared on the Shared Itineraries list on the dashboard
                </span>
              </div>
            </label>
          </div>

          <!-- Success/Error Messages -->
          <div v-if="message" :class="['mt-4 p-3 rounded', messageClass]">
            {{ message }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { fetchItineraryPrivacy, updateItineraryPrivacy } from '../helpers/itinerary';

export default {
  name: 'ItinerarySettingsPage',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const privacySetting = ref('private');
    const message = ref('');
    const messageClass = ref('');

    const goBack = () => {
      router.push(`/itinerary/${route.params.id}`);
    };

    const loadPrivacySettings = async () => {
      const { data, error } = await fetchItineraryPrivacy(route.params.id);
      if (!error && data) {
        privacySetting.value = data.privacy;
      }
    };

    const updatePrivacy = async () => {
      message.value = '';
      const { error } = await updateItineraryPrivacy(route.params.id, privacySetting.value);
      
      if (error) {
        message.value = 'Failed to update privacy settings. Please try again.';
        messageClass.value = 'bg-red-100 text-red-700';
      } else {
        message.value = 'Privacy settings updated successfully!';
        messageClass.value = 'bg-green-100 text-green-700';
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          message.value = '';
        }, 3000);
      }
    };

    onMounted(() => {
      loadPrivacySettings();
    });

    return {
      privacySetting,
      message,
      messageClass,
      goBack,
      updatePrivacy
    };
  }
};
</script>