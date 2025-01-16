<template>
  <div v-if="isDesktop" class="flex-1 overflow-y-auto p-4 bg-blue-100">
    <div class="day-buttons">
      <button v-for="(dayEvents, index) in paginatedEvents" :key="index" @click="currentPage = index + 1" :class="{'active': currentPage === index + 1}">
        Day {{ index + 1 }}
      </button>
    </div>
    <div
      v-for="(dayEvents, index) in paginatedEvents"
      :key="index"
    >
      <div v-if="currentPage === index + 1" class="mb-6 bg-blue-50 rounded-lg shadow p-4">
        <h2 class="text-3xl font-bold mb-2 text-left">
          Day {{ index + 1 }}
        </h2>
        <div v-if="dayEvents.length === 0" class="text-gray-500">
          No events for this day.
        </div>
        <div v-else v-for="event in dayEvents" :key="event.id" class="mb-2">
          <EventEntry
            :eventId="event.id"
            :name="event.name"
            :location="event.location"
            :day="event.day"
            :description="event.description"
            :short_description="event.short_description"
            :isSelected="selectedEventId === event.id"
            :imgUrl="event.img_url"
            :time_start="event.time_start"
            :time_end="event.time_end"
            :isOwner="isOwner"
            @select-event="$emit('select-event', event.id)"
            @edit-event="$emit('edit-event', event.id)"
            @delete-event="$emit('delete-event', event.id)"
            @refresh="$emit('refresh')" 
          />
        </div>
      </div>
    </div>
    <div class="day-buttons">
      <button v-for="(dayEvents, index) in paginatedEvents" :key="index" @click="currentPage = index + 1" :class="{'active': currentPage === index + 1}">
        Day {{ index + 1 }}
      </button>
    </div>
  </div>
  <div v-else class="flex-1 overflow-y-auto bg-blue-100 w-full">
    <div class="day-buttons">
      <button v-for="(dayEvents, index) in paginatedEvents" :key="index" @click="currentPage = index + 1" :class="{'active': currentPage === index + 1}">
        Day {{ index + 1 }}
      </button>
    </div>
    <div
      v-for="(dayEvents, index) in paginatedEvents"
      :key="index"
    >
      <div v-if="currentPage === index + 1" class="mb-6 bg-blue-50 rounded-lg shadow p-4">
        <h2 class="text-3xl font-bold mb-2 text-left">
          Day {{ index + 1 }}
        </h2>
        <div v-if="dayEvents.length === 0" class="text-gray-500">
          No events for this day.
        </div>
        <div v-else v-for="event in dayEvents" :key="event.id" class="mb-2">
          <EventEntry
            :eventId="event.id"
            :name="event.name"
            :location="event.location"
            :day="event.day"
            :description="event.description"
            :isSelected="selectedEventId === event.id"
            :imgUrl="event.img_url"
            :time_start="event.time_start"
            :time_end="event.time_end"
            :isOwner="isOwner"
            @select-event="$emit('select-event', event.id)"
            @edit-event="$emit('edit-event', event.id)"
            @delete-event="$emit('delete-event', event.id)"
          />
        </div>
      </div>
    </div>
    <div class="day-buttons">
      <button v-for="(dayEvents, index) in paginatedEvents" :key="index" @click="currentPage = index + 1" :class="{'active': currentPage === index + 1}">
        Day {{ index + 1 }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, toRefs, watch } from 'vue';
import EventEntry from './EventEntry.vue';

export default {
  name: 'ItineraryEventsList',
  components: {
    EventEntry
  },
  setup(props){
    const { eventsGroupedByDay, itineraryDays } = toRefs(props);
    const isDesktop = ref(window.innerWidth >= 640);
    const currentPage = ref(1);
    const paginatedEvents = ref([]);
    const totalPages = ref(0);

    watch([eventsGroupedByDay, itineraryDays], () => {
      paginatedEvents.value = eventsGroupedByDay.value.slice(0, itineraryDays.value);
      totalPages.value = itineraryDays.value;

      while (paginatedEvents.value.length < totalPages.value) {
        paginatedEvents.value.push([]);
      }
    });

    const checkWindowSize = () => {
      isDesktop.value = window.innerWidth >= 640;
    };
    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };
    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };
    onMounted(() => {
      window.addEventListener('resize', checkWindowSize);
      checkWindowSize();
    });
    onUnmounted(() => {
      window.removeEventListener('resize', checkWindowSize);
    });

    return {
      isDesktop,
      paginatedEvents,
      currentPage,
      totalPages,
      nextPage,
      prevPage
    }
  },
  
  props: {
    eventsGroupedByDay: {
      type: Array,
      required: true
    },
    selectedEventId: {
      type: String,
      default: null
    },
    isOwner: {
      type: Boolean,
      default: false
    },
    itineraryDays: {
      type: Number,
      required: true
    }
  }
};
</script>

<style>
.pagination-controls {
  display: flex;
  justify-content: center;
  margin: 10px 0;
}
.pagination-controls button {
  margin: 0 5px;
  padding: 5px 10px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.pagination-controls button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
.day-buttons {
  display: flex;
  justify-content: center;
  margin: 10px 0;
  flex-wrap: wrap;
}
.day-buttons button {
  margin: 0 5px;
  padding: 5px 10px;
  background-color: #f0f0f0;
  border: 1px solid #cccccc;
  border-radius: 5px;
  cursor: pointer;
}
.day-buttons button.active {
  background-color: #007BFF;
  color: white;
}
</style>
