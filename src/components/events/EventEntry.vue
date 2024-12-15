<template>
  <div class="bg-blue-100 p-6 rounded-lg shadow-lg w-full mt-4">
    <div class="grid grid-cols-3 gap-4">
      <!-- Column #1: Image -->
      <div class="col-span-1">
        <img 
          :src="imgUrl" 
          alt="Event Thumbnail" 
          class="w-full max-h-64 object-cover rounded shadow-md"
        />
      </div>

      <!-- Column #2: Main Texts -->
      <div class="col-span-2 bg-blue-200 p-4 rounded-lg shadow-inner">
        <h2 class="text-3xl font-bold text-gray-800">{{ name }}</h2>
        <p class="text-gray-600">
          Day {{ day || 'not assigned' }}
          <br>
          Time: {{ formatTime(time_start) || 'N/A' }} - {{ formatTime(time_end) || 'N/A' }}
        </p>

        <!-- Location Section -->
        <div class="text-left">
          <h3 class="text-lg font-semibold text-gray-800">Location:</h3>
          <p class="text-gray-700">{{ location }}</p>
        </div>

        <!-- Divider -->
        <hr class="border-gray-300 my-4" />
      </div>
    </div>

    <div class="event-info" ref="infoSprouting">
      <EventInfoSprouting 
        class="transition-all duration-300 w-full" 
        :event="{ eventId, name, location, day, description, imgUrl, time_start, time_end }" 
        :isOwner="isOwner" 
        @show-create-event="$emit('show-create-event')"
      />
    </div>
  </div>
  <div class="arrow-container bg-blue-400 flex justify-center">
    <button @click="toggleInfo" class="arrow-button text-blue-500 hover:text-blue-700">
      <span v-if="!isExpanded">▼</span>
      <span v-else>▲</span>
    </button>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import gsap from 'gsap';
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
    const infoSprouting = ref(null);
    const isExpanded = ref(false);

    const toggleInfo = () => {
      isExpanded.value = !isExpanded.value;
      const targetHeight = isExpanded.value ? 'auto' : '0px';
      gsap.to(infoSprouting.value, {
        height: targetHeight,
        duration: 0.5,
        ease: 'power2.inOut'
      });
    };

    onMounted(() => {
      infoSprouting.value.style.height = '0px';
    });

    return {
      infoSprouting,
      isExpanded,
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

.event-info {
  overflow: hidden;
  height: 0;
}

.arrow-container {
  width: 100%;
  height: 40px; /* Adjust height as needed */
  display: flex;
  align-items: center;
  justify-content: center;
}
.arrow-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}
</style>
