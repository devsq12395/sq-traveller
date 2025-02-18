<template>
  <div v-if="isDesktop" class="itinerary-info mx-auto bg-blue-100 rounded-lg" style="width: 100%;">
    <div class="p-4 border-b border-gray-300 flex-shrink-0">
      <!-- Buttons Container -->
      <div class="flex justify-between space-x-4 mt-6">
        <!-- Left Side -->
        <div class="flex items-end gap-4">
          <button
            @click="goToDashboard"
            class="p-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            ← Back
          </button>
          <button
            @click="$emit('show-share')"
            class="p-2 bg-gray-100 text-blue-500 border border-blue-500 rounded hover:bg-blue-200 flex items-center"
          >
            <span class="material-icons mr-2">share</span>
            Share
          </button>
          <div class="relative">
            <button
              v-if="isOwner"
              @click="toggleDropdown"
              class="p-2 bg-gray-100 text-blue-500 border border-blue-500 rounded hover:bg-blue-200 flex items-center"
            >
              <span class="material-icons">more_vert</span>
            </button>
            <div v-if="dropdownVisible" class="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
              <button
                @click="$emit('show-edit-itinerary')"
                class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Edit Itinerary
              </button>
            </div>
          </div>
        </div>

        <!-- Right Side -->
        <div v-if="isOwner" class="flex items-end gap-4">
          <button
            @click="$emit('show-create-event')"
            class="p-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Create Event
          </button>
        </div>
        <div v-else class="flex items-end gap-4">
          <button
            @click="$emit('show-report-event')"
            class="p-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Report Event
          </button>
        </div>
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
            @refresh="$emit('refresh')"
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
          :updatePrivacy="updatePrivacy"
        />
      </div>
    </div>
  </div>
  <div v-else class="itinerary-info mx-auto bg-blue-100 rounded-lg" style="width: 100%;">
    <!-- Add itinerary image and description -->
    <div class="p-4 border-b border-gray-300 flex-shrink-0">
      <!-- Buttons Container -->
      <div class="flex justify-between space-x-4 mt-6">
        <!-- Left Side -->
        <div class="flex items-stretch gap-4 text-sm">
          <button
            @click="goToDashboard"
            class="p-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            ← Back
          </button>
          <button
            v-if="isOwner"
            class="p-2 bg-gray-100 text-blue-500 border border-blue-500 rounded hover:bg-blue-200 flex items-center"
          >
            <span class="material-icons mr-2">share</span>
            Share
          </button>
          <div class="relative">
            <button
              v-if="isOwner"
              @click="toggleDropdown"
              class="p-2 bg-gray-100 text-blue-500 border border-blue-500 rounded hover:bg-blue-200 flex items-center"
            >
              <span class="material-icons">more_vert</span>
            </button>
            <div v-if="dropdownVisible" class="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
              <button
                @click="$emit('show-edit-itinerary')"
                class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Edit Itinerary
              </button>
            </div>
          </div>
        </div>

        <!-- Right Side -->
        <div class="flex items-stretch gap-4 text-sm">
          <div v-if="isOwner">
            <button
              @click="$emit('show-create-event')"
              class="p-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Create Event
            </button>
          </div>
          <div v-else>
            <button
              @click="$emit('show-report-event')"
              class="p-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Report Event
            </button>
          </div>
        </div>
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
        <div class="py-4 px-0">
          <ItineraryEventsList
            :eventsGroupedByDay="eventsGroupedByDay"
            :selectedEventId="selectedEventId"
            :isOwner="isOwner"
            :itineraryDays="itineraryDays"
            @select-event="$emit('select-event', $event)"
            @edit-event="$emit('edit-event', $event)"
            @delete-event="$emit('delete-event', $event)"
            @refresh="$emit('refresh')"
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
          :updatePrivacy="updatePrivacy"
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
    const dropdownVisible = ref(false);

    const toggleDropdown = () => {
      dropdownVisible.value = !dropdownVisible.value;
    };

    return {
      isDesktop,
      dropdownVisible,
      toggleDropdown,
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
    async updatePrivacy(newPrivacySetting) {
      const { error } = await updateItineraryPrivacy(this.itineraryId, newPrivacySetting);
      if (error) {
        console.error('Failed to update privacy settings:', error);
      }
    }
  }
};
</script>