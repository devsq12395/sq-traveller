<template>
  <div v-if="showPopup" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-70">
    <div class="bg-white rounded-lg shadow-xl w-full" style="height: calc(100vh - 5vh); margin-top: 10vh; position: relative; bottom: 0;">
      <!-- Close Button, commented out for now -->
      <!-- <button @click="closePopup" class="absolute top-12 left-4 text-gray-500 hover:text-gray-700 z-10 bg-white bg-opacity-25 rounded-full w-5 h-5 flex items-center justify-center">
        <span class="text-2xl">&times;</span>
      </button> -->

      <!-- Image and Event Name -->
      <div class="overflow-auto h-full">
        <div class="bg-purple-100 rounded bg-opacity-75">
          <img :src="eventImage" alt="Event Image" class="w-full h-64 object-cover" />
          <div class="p-4">
            <h2 class="text-2xl font-bold mb-2 text-left">{{ eventName }}</h2>
            <p class="text-sm text-gray-500 text-left">Location: {{ eventLocation }}</p>
            <p class="text-sm text-gray-500 text-left">Day {{ eventDate }}</p>
            <p class="text-sm text-gray-500 text-left">{{ eventTime }}</p>
          </div>
        </div>

        <!-- Back Button -->
        <button @click="closePopup" class="mt-4 m-2 text-gray-500 hover:text-gray-700 z-10 bg-gray-200 rounded px-3 py-1 flex items-center justify-center">
          <span class="text-sm">← Back</span>
        </button>


        <!-- Tabs Section -->
        <div class="overflow-x-auto">
          <div class="flex border-b border-gray-300">
            <button
              v-for="tab in tabs"
              :key="tab"
              @click="currentTab = tab"
              :class="{
                'border-b-2 border-blue-500 text-blue-600': currentTab === tab,
                'hover:text-blue-500': true
              }"
              class="flex-1 px-3 py-1 text-center text-xs font-medium text-gray-600 whitespace-nowrap"
            >
              {{ tab }}
            </button>
          </div>
          <div class="mt-4 bg-white p-4 rounded shadow-inner">
            <component 
              :is="currentTabComponent" 
              ref="currentTabComponentRef"
              :eventId="eventId" 
              :isOwner="isOwner" 
              :description="eventDesc" 
              :notes="notes" 
              :key="eventId"
              @show-add-todo="handleShowAddTodo"
              @show-add-budget="handleShowAddBudget"
              @show-add-note="handleShowAddNote"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { eventPopupsState, setEventInfoPopupShow, 
  setCreateTodoPopupShow, setCreateBudgetPopupShow, setCreateNotePopupShow } from '@/context/UserContext';
import EventDescription from '@/components/events/EventDescription';
import EventActivities from '@/components/events/EventActivities';
import EventBudgets from '@/components/events/EventBudgets';
import EventNotes from '@/components/events/EventNotes';
import { fetchEvent } from '../../helpers/event';

export default {
  components: { EventDescription, EventActivities, EventBudgets, EventNotes },
  props: {
    eventId: Number,
    isOwner: Boolean
  },
  setup() {
    const showPopup = computed(() => eventPopupsState.isEventInfoPopupShow);
    const tabs = ['Description', 'Activities', 'Budget', 'Notes'];
    const currentTab = ref('Description');

    const eventId = ref(0);
    const eventImage = ref('');
    const eventName = ref('');
    const eventDate = ref('');
    const eventTime = ref('');
    const eventDesc = ref('');
    const eventLocation = ref('');

    const currentTabComponent = computed(() => {
      switch (currentTab.value) {
        case 'Activities':
          return EventActivities;
        case 'Budget':
          return EventBudgets;
        case 'Notes':
          return EventNotes;
        default:
          return EventDescription;
      }
    });

    const closePopup = () => {
      setEventInfoPopupShow(eventId.value, false);
    };

    watch(() => eventPopupsState.isEventInfoPopupShow, (newValue) => {
      if (newValue) {
        eventId.value = eventPopupsState.eventId;
        fetchEvent(eventId.value).then(event => {
          eventImage.value = event.data.img_url;
          eventDesc.value = event.data.description;
          eventLocation.value = event.data.location;
          eventName.value = event.data.name;
          eventDate.value = event.data.day;
          eventTime.value = event.data.time_start + ' - ' + event.data.time_end;
        });

      }
    });

    return {
      showPopup,
      closePopup,
      tabs,
      currentTab,
      currentTabComponent,
      eventName,
      eventDate,
      eventTime,
      eventImage,
      eventDesc,
      eventLocation
    };
  },
  methods: {
    handleShowAddTodo() {
      setCreateTodoPopupShow(this.selectedEventId, true);
    },
    handleShowAddBudget() {
      setCreateBudgetPopupShow(this.selectedEventId, true);
    },
    handleShowAddNote() {
      setCreateNotePopupShow(this.selectedEventId, true);
    },

    triggerChildUpdates() {
      if (this.currentTab === 'Activities' && this.$refs.currentTabComponentRef) {
        this.$refs.currentTabComponentRef.updateActivity();
      }
      if (this.currentTab === 'Budget' && this.$refs.currentTabComponentRef) {
        this.$refs.currentTabComponentRef.loadBudgets();
      }
    },
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
.bg-opacity-50 {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>