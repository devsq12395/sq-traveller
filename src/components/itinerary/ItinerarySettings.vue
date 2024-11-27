<template>
  <div class="h-full">
    <div class="p-4 space-y-6">
      <div class="border-b border-gray-200 pb-6">
        <h2 class="text-xl font-semibold mb-4">Privacy Settings</h2>
        <div class="space-y-4">
          <!-- Private Option -->
          <label class="flex items-start space-x-3 cursor-pointer">
            <input
              type="radio"
              name="privacy"
              value="private"
              v-model="localPrivacySetting"
              class="mt-1"
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
              v-model="localPrivacySetting"
              class="mt-1"
            />
            <div>
              <span class="font-medium block">Public</span>
              <span class="text-sm text-gray-500">Anyone with the link can view this itinerary</span>
            </div>
          </label>
          <!-- Shared Option -->
          <label class="flex items-start space-x-3 cursor-pointer">
            <input
              type="radio"
              name="privacy"
              value="shared"
              v-model="localPrivacySetting"
              class="mt-1"
            />
            <div>
              <span class="font-medium block">Shared</span>
              <span class="text-sm text-gray-500">Anyone can view this itinerary and will be shared on the "Shared Itineraries" list</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    privacySetting: String
  },
  data() {
    return {
      localPrivacySetting: this.privacySetting
    };
  },
  watch: {
    privacySetting(newVal) {
      this.localPrivacySetting = newVal;
    },
    localPrivacySetting(newVal) {
      this.$emit('update:privacySetting', newVal);
      this.$emit('update-privacy');
    }
  }
};
</script>