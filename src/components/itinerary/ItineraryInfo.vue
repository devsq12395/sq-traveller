<template>
  <div v-if="isDesktop" class="itinerary-info mx-auto bg-blue-100 rounded-lg" style="width: 100%;">
    <!-- Add itinerary image and description -->
    <div class="p-4 border-b border-gray-300 flex-shrink-0">
      <!-- Buttons Container -->
      <div v-if="isOwner" class="flex space-x-4 mt-6">
        <button
          @click="goToDashboard"
          class="p-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          ← Back to Dashboard
        </button>
        <button
          @click="$emit('show-create-event')"
          class="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create Event
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex border-b border-gray-200 bg-blue-50">
      <button
        v-for="tab in availableTabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        class="px-10 py-2 text-sm font-medium"
        :class="[
          activeTab === tab.id
            ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-100'
            : 'text-gray-500 hover:text-gray-700 hover:bg-blue-100'
        ]"
      >
        {{ tab.name }}
      </button>
    </div>

    <!-- Tab Content -->
    <div class="flex-1 overflow-y-auto">
      <!-- Details Tab -->
      <div v-if="activeTab === 'details'" class="h-full">
        <div class="p-4">
          <ItineraryEventsList
            :eventsGroupedByDay="eventsGroupedByDay"
            :selectedEventId="selectedEventId"
            :isOwner="isOwner"
            :itineraryDays="itineraryDays"
            @select-event="$emit('select-event', $event)"
            @edit-event="$emit('edit-event', $event)"
            @delete-event="$emit('delete-event', $event)"
          />
        </div>
      </div>

      <!-- Ratings Tab -->
      <div v-if="activeTab === 'ratings'" class="h-full bg-blue-100">
        <ItineraryRatings 
          :itineraryId="itineraryId" 
        />
      </div>

      <!-- Comments Tab -->
      <div v-if="activeTab === 'comments'" class="h-full bg-blue-100">
        <ItineraryComments 
          :itineraryId="itineraryId" 
          @update:commentCount="commentCount = $event"
        />
      </div>

      <!-- Settings Tab -->
      <div v-if="activeTab === 'settings' && isOwner" class="h-full">
        <ItinerarySettings
          :privacySetting="privacySetting"
          @update:privacySetting="privacySetting = $event"
          @update-privacy="updatePrivacy"
        />
      </div>
    </div>
  </div>
  <div v-else class="itinerary-info mx-auto bg-blue-100 rounded-lg" style="width: 100%;">
    <!-- Add itinerary image and description -->
    <div class="p-4 border-b border-gray-300 flex-shrink-0">
      <!-- Buttons Container -->
      <div v-if="isOwner" class="flex space-x-4 mt-6">
        <button
          @click="goToDashboard"
          class="p-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          ← Back to Dashboard
        </button>
        <button
          @click="$emit('show-create-event')"
          class="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create Event
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex border-b border-gray-200 bg-blue-50">
      <button
        v-for="tab in availableTabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        class="px-2 py-1 text-xs font-medium"
        :class="[
          activeTab === tab.id
            ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-100'
            : 'text-gray-500 hover:text-gray-700 hover:bg-blue-100'
        ]"
      >
        {{ tab.name }}
      </button>
    </div>

    <!-- Tab Content -->
    <div class="flex-1 overflow-y-auto">
      <!-- Details Tab -->
      <div v-if="activeTab === 'details'" class="h-full">
        <div class="p-4">
          <ItineraryEventsList
            :eventsGroupedByDay="eventsGroupedByDay"
            :selectedEventId="selectedEventId"
            :isOwner="isOwner"
            :itineraryDays="itineraryDays"
            @select-event="$emit('select-event', $event)"
            @edit-event="$emit('edit-event', $event)"
            @delete-event="$emit('delete-event', $event)"
          />
        </div>
      </div>

      <!-- Ratings Tab -->
      <div v-if="activeTab === 'ratings'" class="h-full bg-blue-100">
        <ItineraryRatings 
          :itineraryId="itineraryId" 
        />
      </div>

      <!-- Comments Tab -->
      <div v-if="activeTab === 'comments'" class="h-full bg-blue-100">
        <ItineraryComments 
          :itineraryId="itineraryId" 
          @update:commentCount="commentCount = $event"
        />
      </div>

      <!-- Settings Tab -->
      <div v-if="activeTab === 'settings' && isOwner" class="h-full">
        <ItinerarySettings
          :privacySetting="privacySetting"
          @update:privacySetting="privacySetting = $event"
          @update-privacy="updatePrivacy"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { fetchItineraryPrivacy, updateItineraryPrivacy, fetchItineraryWithCreator } from '../../helpers/itinerary';
import ItinerarySettings from './ItinerarySettings.vue';
import ItineraryComments from './ItineraryComments.vue';
import ItineraryRatings from './ItineraryRatings.vue';
import ItineraryEventsList from '../events/ItineraryEventsList.vue';

export default {
  name: 'ItineraryInfo',
  components: {
    ItinerarySettings,
    ItineraryComments,
    ItineraryRatings,
    ItineraryEventsList
  },
  props: {
    itineraryId: {
      type: String,
      required: true
    },
    itineraryName: String,
    itineraryDescription: String,
    eventsGroupedByDay: Array,
    selectedEventId: String,
    isOwner: {
      type: Boolean,
      default: false
    }
  },
  setup(){
    const windowWidth = ref(window.innerWidth);
    const isDesktop = computed(() => windowWidth.value >= 768);

    return {
      isDesktop
    }
  },
  data() {
    return {
      activeTab: 'details',
      commentCount: 0,
      allTabs: [
        { id: 'details', name: 'Daily Events' },
        { id: 'ratings', name: 'Ratings' },
        { id: 'comments', name: () => `Comments (${this.commentCount})` },
        { id: 'settings', name: 'Settings', ownerOnly: true }
      ],
      privacySetting: 'private',
      itineraryDays: 0,
      creatorName: '',
      itineraryImgUrl: 'https://via.placeholder.com/150',
    };
  },
  computed: {
    availableTabs() {
      return this.allTabs.map(tab => ({
        ...tab,
        name: typeof tab.name === 'function' ? tab.name() : tab.name
      })).filter(tab => !tab.ownerOnly || this.isOwner);
    }
  },
  async created() {
    const { data } = await fetchItineraryWithCreator(this.itineraryId);
    if (data) {
      this.itineraryDays = data.days;
      this.creatorName = data.creatorName;
      this.itineraryImgUrl = data.img_url;
    }
    await this.loadPrivacySettings();
  },
  methods: {
    goToDashboard() {
      this.$emit('go-to-dashboard');
    },
    async loadPrivacySettings() {
      const { data } = await fetchItineraryPrivacy(this.itineraryId);
      if (data) {
        this.privacySetting = data.privacy;
      }
    },
    async updatePrivacy() {
      const { error } = await updateItineraryPrivacy(this.itineraryId, this.privacySetting);
      if (error) {
        console.error('Failed to update privacy settings:', error);
      }
    }
  }
};
</script>