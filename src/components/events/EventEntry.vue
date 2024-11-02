<template>
  <div
    :class="[
      'flex items-start shadow-lg rounded-lg p-4 mb-4 transition duration-300 cursor-pointer',
      isSelected ? 'bg-yellow-300' : 'bg-yellow-200 hover:bg-yellow-300'
    ]"
    @click="onSelect"
  >
    <!-- Icon or Thumbnail -->
    <img
      src="https://via.placeholder.com/50"
      alt="Event Thumbnail"
      class="w-12 h-12 rounded-md mr-4 border border-gray-300 shadow-sm"
    />

    <!-- Event Details -->
    <div class="flex-1">
      <!-- Location Name -->
      <h3 class="text-xl font-semibold text-gray-800">{{ location }}</h3>

      <!-- Time Range -->
      <p class="text-gray-700 text-sm mb-2">
        <span class="font-semibold">Start:</span> {{ formatDate(time_start) }}<br>
        <span class="font-semibold">End:</span> {{ formatDate(time_end) }}
      </p>

      <!-- Description -->
      <p class="text-gray-600 text-sm">{{ description }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EventEntry',
  props: {
    location: {
      type: String,
      required: true,
    },
    time_start: {
      type: String,
      required: true,
    },
    time_end: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
      return new Date(date).toLocaleString(undefined, options);
    },
    onSelect() {
      this.$emit('select-event');
    },
  },
};
</script>
