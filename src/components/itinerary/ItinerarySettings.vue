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
              :checked="privacySetting === 'private'"
              class="mt-1"
              @change="$emit('update:privacySetting', 'private')"
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
              :checked="privacySetting === 'public'"
              class="mt-1"
              @change="$emit('update:privacySetting', 'public')"
            />
            <div>
              <span class="font-medium block">Public</span>
              <span class="text-sm text-gray-500">Anyone with the link can view this itinerary</span>
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
  methods: {
    updatePrivacy() {
      this.$emit('update-privacy');
    }
  }
};
</script>
