<template>
  <div class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
    <div class="bg-gray-100 p-6 rounded shadow-lg w-full md:w-[900px]" style="max-height: 92vh; margin-top: 5vh;">
      <h2 class="text-2xl font-bold mb-4">Share Itinerary</h2>

      <div class="border-b border-gray-200 mb-6"></div>

      <label class="block text-gray-700 mb-2 text-left font-semibold">Link:</label>
      <div class="flex items-center mb-4">
        <input type="text" class="flex-grow p-2 border border-gray-300 rounded mr-2" :value="currentUrl" readonly />
        <button @click="copyLink" class="bg-blue-500 text-white px-4 py-2 rounded">Copy Link</button>
      </div>

      <p v-if="copySuccess" class="text-green-500">Link copied to clipboard!</p>

      <p>Copy the link and share it with your friends!</p>

      <!-- <ItineraryPrivacySettings 
        :privacySetting="privacySetting"
        :itinerary-id="itineraryId" 
        @aupdate-privcy="updatePrivacy($event)"
      /> -->

      <button @click="$emit('close')" class="mt-4 bg-red-500 text-white px-4 py-2 rounded">Close</button>
    </div>
  </div>
</template>

<script>
// import ItineraryPrivacySettings from '../common/settings/ItineraryPrivacySettings.vue';
import { fetchItineraryPrivacy, updateItineraryPrivacy } from '@/helpers/itinerary';

export default {
  name: 'SharePopup',
  props: {
    itineraryId: { type: String, required: true }
  },
  data() {
    return {
      currentUrl: '',
      privacySetting: 'private',
      copySuccess: false
    };
  },
  mounted() {
    this.currentUrl = window.location.href;
  },
  async created() {
    await this.loadPrivacySettings();
  },
  components: {
    //ItineraryPrivacySettings
  },
  methods: {
    copyLink() {
      navigator.clipboard.writeText(this.currentUrl).then(() => {
        this.copySuccess = true;
        setTimeout(() => this.copySuccess = false, 3000);
      }, (err) => {
        console.error('Could not copy text: ', err);
      });
    },
    async loadPrivacySettings() {
      const { data } = await fetchItineraryPrivacy(this.itineraryId);
      if (data) {
        this.privacySetting = data.privacy;
      }
    },
    async updatePrivacy(newPrivacySetting) {
      const { error } = await updateItineraryPrivacy(this.itineraryId, newPrivacySetting);
      if (error) {
        console.error('Failed to update privacy settings:', error);
      }
    }
  }
};
</script>