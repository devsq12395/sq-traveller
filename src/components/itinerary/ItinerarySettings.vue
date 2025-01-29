<template>
  <div class="h-full">
    <ItineraryPrivacySettings
      :privacySetting="privacySetting"
      @update-privacy="updatePrivacy($event)"
    />
  </div>
</template>

<script>
import ItineraryPrivacySettings from '../common/settings/ItineraryPrivacySettings.vue';

export default {
  props: {
    updatePrivacy: Function,
    privacySetting: String
  },
  components: {
    ItineraryPrivacySettings
  }
};
</script>