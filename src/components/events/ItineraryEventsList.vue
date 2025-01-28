<template>
  <div v-if="isDesktop" class="flex-1 overflow-y-auto p-4 bg-blue-100">
    <div class="flex justify-center my-2 flex-wrap">
      <button v-for="(dayEvents, index) in paginatedEvents" :key="index" @click="currentPage = index + 1" :class="['mx-1 my-1 px-2 border border-gray-300 rounded cursor-pointer', currentPage === index + 1 ? 'bg-blue-200 text-black' : 'bg-gray-100']">
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
    <div class="flex justify-center my-2 flex-wrap">
      <button v-for="(dayEvents, index) in paginatedEvents" :key="index" @click="currentPage = index + 1" :class="['mx-1 my-1 px-2 border border-gray-300 rounded cursor-pointer', currentPage === index + 1 ? 'bg-blue-200 text-black' : 'bg-gray-100']">
        Day {{ index + 1 }}
      </button>
    </div>
  </div>
  <div v-else class="flex-1 overflow-y-auto bg-blue-100 w-full">
    <div class="flex justify-center my-2 flex-wrap">
      <button v-for="(dayEvents, index) in paginatedEvents" :key="index" @click="currentPage = index + 1" :class="['mx-1 my-1 px-2 border border-gray-300 rounded cursor-pointer', currentPage === index + 1 ? 'bg-blue-200 text-black' : 'bg-gray-100']">
        Day {{ index + 1 }}
      </button>
    </div>
    <div
      v-for="(dayEvents, index) in paginatedEvents"
      :key="index"
    >
      <div v-if="currentPage === index + 1" class="mb-6 bg-blue-50 rounded-lg shadow py-4 px-2">
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
          />
        </div>
      </div>
    </div>
    <div class="flex justify-center my-2 flex-wrap">
      <button v-for="(dayEvents, index) in paginatedEvents" :key="index" @click="currentPage = index + 1" :class="['mx-1 my-1 px-2 border border-gray-300 rounded cursor-pointer', currentPage === index + 1 ? 'bg-blue-200 text-black' : 'bg-gray-100']">
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
  props: {
    eventsGroupedByDay: { type: Array, required: true },
    selectedEventId: { type: String, default: null },
    isOwner: { type: Boolean, default: false },
    itineraryDays: { type: Number, required: true }
  },
  setup(props){
    const { eventsGroupedByDay, itineraryDays } = toRefs(props);
    const isDesktop = ref(window.innerWidth >= 640);
    const currentPage = ref(1);
    const paginatedEvents = ref([]);
    const totalPages = ref(itineraryDays.value);

    watch([eventsGroupedByDay, itineraryDays], () => {
      reloadEvents();
    });

    const reloadEvents = () => {
      paginatedEvents.value = [];
      totalPages.value = itineraryDays.value;

      while (paginatedEvents.value.length < itineraryDays.value) {
        paginatedEvents.value.push([]);
      }

      eventsGroupedByDay.value.forEach((events) => {
        events.forEach((event) => {
          if (event.day - 1 < paginatedEvents.value.length) {
            paginatedEvents.value[event.day - 1].push(event);
          }
        });
      });
    };

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
      reloadEvents();
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
      prevPage,
      reloadEvents
    }
  },
};
</script>