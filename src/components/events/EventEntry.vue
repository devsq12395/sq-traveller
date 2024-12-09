<template>
  <div
    :class="[
      'flex items-start shadow-lg rounded-lg p-4 mb-4 transition duration-300 cursor-pointer',
      isSelected ? 'bg-yellow-300' : 'bg-yellow-200 hover:bg-yellow-300'
    ]"
    @click="onSelect"
    style="height: 180px;"
  >
    <!-- Icon or Thumbnail -->
    <img
      :src="imgUrl"
      alt="Event Thumbnail"
      class="w-16 h-[90%] rounded-md mr-4 border border-gray-300 shadow-sm"
    />

    <!-- Event Details -->
    <div class="flex-1">
      <!-- Name -->
      <h3 class="text-xl font-semibold text-gray-800">{{ name }}</h3>

      <!-- Time Range -->
      <p class="text-gray-700 text-sm mb-2">
        <span class="font-semibold">Day:</span> {{ day }}<br>
        <span class="font-semibold">Time:</span> {{ formatTime(time_start) || 'N/A' }} - {{ formatTime(time_end) || 'N/A' }}
      </p>
      
      <!-- Location -->
      <p class="text-gray-700 text-sm mb-2">
        <span class="font-semibold">Location:</span> {{ location }}
      </p>

      <!-- Description -->
      <p class="text-gray-600 text-sm">{{ truncatedDescription }}</p>
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
/* Add custom styling if needed */
</style>
