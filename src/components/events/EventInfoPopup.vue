<template>
  <div v-if="showPopup" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-70">
    <div class="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full mx-4">
      <h2 class="text-2xl font-bold mb-4">Event Details</h2>
      <img :src="eventImage" alt="Event Image" class="w-full h-48 object-cover mb-4" />
      <p class="text-gray-700 mb-4">{{ eventDescription }}</p>
      <button @click="closePopup" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Close</button>
    </div>
  </div>
</template>

<script>
import { computed, watch } from 'vue';
import { eventPopupsState, setEventInfoPopupShow } from '@/context/UserContext';

export default {
  components: {  },
  props: {
    eventId: Number,
    eventImage: String,
    eventDescription: String,
    isOwner: Boolean,
    selectedEventId: Number
  },
  setup(props) {
    console.log('isEventInfoPopupShow:', eventPopupsState.isEventInfoPopupShow);
    const showPopup = computed(() => eventPopupsState.isEventInfoPopupShow);

    const closePopup = () => {
      setEventInfoPopupShow(props.selectedEventId, false);
    };

    watch(() => eventPopupsState.isEventInfoPopupShow, (newValue) => {
      console.log('isEventInfoPopupShow changed:', newValue);
    });

    return {
      showPopup,
      closePopup
    };
  }
};
</script>

<style scoped>
.fixed {
  position: fixed;
}
.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
