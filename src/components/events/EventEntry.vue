<template>
  <div
    class="flex shadow-lg rounded-lg mb-4 transition duration-300 cursor-pointer bg-blue-100 hover:bg-blue-200"
    @click="onSelect"
    style="height: 120px;"
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
  </div>
</template>

<script>
export default {
  name: 'EventEntry',
  props: {
    name: { type: String, required: true },
    location: { type: String, required: true },
    day: { type: String, required: true, default: 'No day assigned' },
    description: { type: String, required: true },
    imgUrl: { type: String, required: false, default: 'https://via.placeholder.com/50' },
    time_start: { type: String, required: false, default: '' },
    time_end: { type: String, required: false, default: '' },
    isSelected: { type: Boolean, default: false },
    isOwner: { type: Boolean, default: false },
  },
  computed: {
    truncatedDescription() {
      const _description = this.description || ''; 
      return _description.length > 70 ? _description.substring(0, 70) + '...' : _description;
    }
  },
  methods: {
    onSelect() {
      this.$emit('select-event');
    },
    formatTime(time) {
      if (!time) return '';
      return time.substring(0, 5); // Takes only HH:mm part
    }
  },
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
