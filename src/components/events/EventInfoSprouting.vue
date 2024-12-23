<template>
  <div class="bg-gray-50 p-6 rounded-lg shadow-lg w-full mt-4">
    

    <!-- Tabs Section -->
    <div>
      <div class="flex border-b border-gray-300">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="currentTab = tab"
          :class="{
            'border-b-2 border-blue-500 text-blue-600': currentTab === tab,
            'hover:text-blue-500': true
          }"
          class="flex-1 px-6 py-2 text-center text-sm font-medium text-gray-600"
        >
          {{ tab }}
        </button>
      </div>
      <div class="mt-4 bg-white p-4 rounded shadow-inner">
        <component 
          :is="currentTabComponent" 
          ref="currentTabComponentRef"
          :eventId="event.eventId" 
          :isOwner="isOwner" 
          :description="event.description" 
          :notes="notes" 
          :key="event.eventId"
          @show-add-todo="handleShowAddTodo"
          @show-add-budget="handleShowAddBudget"
          @show-add-note="handleShowAddNote"
        />
      </div>
    </div>

    <!-- EditEventPopup -->
    <EditEventPopup 
      v-if="showEditEventPopup" 
      :eventId="event.id" 
      @close="showEditEventPopup = false"
      @refresh="$emit('refresh')" 
      @eventUpdated="$emit('eventUpdated')"
    />

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
        <h3 class="text-xl font-bold mb-4">Delete Event</h3>
        <p class="text-gray-700 mb-6">Are you sure you want to delete this event? This action cannot be undone.</p>
        <div class="flex justify-end space-x-4">
          <button
            @click="showDeleteConfirm = false"
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            @click="handleDelete"
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import EventDescription from './EventDescription.vue';
import EventActivities from './EventActivities.vue';
import EventBudgets from './EventBudgets.vue';
import EventNotes from './EventNotes.vue';
import { fetchEventNotes } from '../../helpers/notes';
import { deleteEvent } from '../../helpers/event';
import EditEventPopup from '../popups/EditEventPopup.vue';
import { setCreateTodoPopupShow, setCreateNotePopupShow, setCreateBudgetPopupShow } from '../../context/UserContext';

export default {
  name: 'EventInfoSprouting',
  components: {
    EventDescription,
    EventActivities,
    EventBudgets,
    EventNotes,
    EditEventPopup
  },
  props: {
    event: {
      type: Object,
      required: true
    },
    isOwner: Boolean,
    visible: Boolean
  },
  setup() {
    const tabs = ['Description', 'Activities', 'Budget', 'Notes'];
    const currentTab = ref('Description');

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

    return {
      tabs,
      currentTab,
      currentTabComponent
    };
  },
  data() {
    return {
      showEditEventPopup: false,
      showDeleteConfirm: false,
      notes: []
    };
  },
  watch: {
    event: {
      handler() {
        this.fetchNotes();
      },
      immediate: true
    }
  },
  methods: {
    handleShowAddTodo() {
      setCreateTodoPopupShow(this.event.eventId, true);
    },
    handleShowAddNote() {
      setCreateNotePopupShow(this.event.eventId, true);
    },
    handleShowAddBudget() {
      setCreateBudgetPopupShow(this.event.eventId, true);
    },
    triggerChildUpdates() {
      if (this.currentTab === 'Activities' && this.$refs.currentTabComponentRef) {
        this.$refs.currentTabComponentRef.updateActivity();
      }
      if (this.currentTab === 'Budget' && this.$refs.currentTabComponentRef) {
        this.$refs.currentTabComponentRef.loadBudgets();
      }
    },
    formatTime(time) {
      if (!time) return 'N/A';
      const [hour, minute] = time.split(':');
      return `${hour}:${minute}`;
    },
    async fetchNotes() {
      const { data } = await fetchEventNotes(this.event.eventId);
      this.notes = data;
    },
    confirmDelete() {
      this.showDeleteConfirm = true;
    },
    async handleDelete() {
      await deleteEvent(this.event.id);
      this.$emit('refresh');
      this.showDeleteConfirm = false;
    }
  }
};
</script>

<style scoped>
</style>
