<template>
  <div class="flex-1 overflow-y-auto p-4 bg-blue-100">
    <div
      v-for="(dayEvents, index) in eventsGroupedByDay"
      :key="index"
      class="mb-6 bg-blue-50 rounded-lg shadow p-4"
    >
      <h2 class="text-xl font-bold mb-2 text-center">
        Day {{ dayEvents[0].day }}
      </h2>
      <div v-for="event in dayEvents" :key="event.id" class="mb-2">
        <EventEntry
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
</template>

<script>
import EventEntry from './EventEntry.vue';

export default {
  name: 'ItineraryEventsList',
  components: {
    EventEntry
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
    }
  }
};
</script>
