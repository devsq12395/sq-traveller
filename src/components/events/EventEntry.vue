<template>
  <div
    class="flex flex-col shadow-lg rounded-lg mb-4 transition-all duration-300 cursor-pointer bg-blue-100 hover:bg-blue-200"
    @click="toggleInfo"
    style="min-height: 120px;"
  >
    <!-- Thumbnail taking 100% height and starting at 0 x position -->
    <div class="relative h-full w-[25%] rounded-l-lg overflow-hidden">
      <img
        :src="imgUrl"
        alt="Event Thumbnail"
        class="absolute top-0 left-0 w-full h-full object-cover"
      />
    </div>

    <!-- Event Details -->
    <div class="flex flex-1">
      <!-- Left Column: Title, Day, and Time -->
      <div class="flex-1 p-4 text-left">
        <h3 class="text-xl font-semibold text-gray-800">{{ name }}</h3>
        <p class="text-gray-700 text-sm mb-1">
          <span class="font-semibold">Day:</span> {{ day }}
        </p>
        <p class="text-gray-700 text-sm">
          <span class="font-semibold">Time:</span> {{ formatTime(time_start) || 'N/A' }} - {{ formatTime(time_end) || 'N/A' }}
        </p>
      </div>

      <!-- Right Column: Location and Description -->
      <div class="flex-1 p-4 text-right">
        <p class="text-gray-700 text-sm mb-1">
          <span class="font-semibold">Location:</span> {{ location }}
        </p>
        <p class="text-gray-600 text-sm">{{ truncatedDescription }}</p>
      </div>
    </div>
    <EventInfoSprouting v-if="showInfo" :event="{ eventId, name, location, day, description, imgUrl, time_start, time_end }" :isOwner="isOwner" :visible="showInfo" class="transition-all duration-300" />
  </div>
</template>

<script>
import { ref } from 'vue';
import EventInfoSprouting from './EventInfoSprouting.vue';

export default {
  name: 'EventEntry',
  components: {
    EventInfoSprouting
  },
  props: {
    eventId: { type: String, required: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    day: { type: String, required: true, default: 'No day assigned' },
    description: { type: String, required: true },
    imgUrl: { type: String, required: true },
    time_start: { type: String, required: true },
    time_end: { type: String, required: true },
    isOwner: { type: Boolean, default: false }
  },
  setup() {
    const showInfo = ref(false);

    function toggleInfo() {
      showInfo.value = !showInfo.value;
    }

    return {
      showInfo,
      toggleInfo
    };
  },
  computed: {
    truncatedDescription() {
      return this.description.length > 100 ? this.description.substring(0, 100) + '...' : this.description;
    }
  },
  methods: {
    formatTime(time) {
      if (!time) return 'N/A';
      const [hour, minute] = time.split(':');
      return `${hour}:${minute}`;
    }
  }
};
</script>

<style scoped>
/* Image Scaling on Hover */
.relative img {
  transition: transform 0.3s ease;
}
.relative:hover img {
  transform: scale(1.05);
}
</style>
