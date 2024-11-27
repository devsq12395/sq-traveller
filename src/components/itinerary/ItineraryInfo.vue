<template>
  <div class="w-1/3 bg-blue-100 rounded-lg flex flex-col h-[calc(100vh-10rem)]">
    <!-- Add itinerary image and description -->
    <div class="p-4 border-b border-gray-300 flex-shrink-0">
      <div class="flex items-start">
        <img :src="itineraryImgUrl" alt="Itinerary Image" class="w-24 h-24 object-cover rounded-lg mr-2" />
        <div class="flex-grow">
          <div class="flex justify-between items-start">
            <div class="w-full pr-8 text-left">
              <h1 class="text-2xl font-semibold">{{ itineraryName }}</h1>
              <p class="text-sm text-gray-600 mt-1 line-clamp-4 h-[5rem]">{{ itineraryDescription }}</p>
            </div>
          </div>
        </div>
      </div>
      <!-- Metadata section -->
      <div class="flex-col text-sm text-gray-500 mt-4 pt-4 border-t border-gray-300">
        <div class="flex items-center">
          <span class="mr-1">Number of days:</span>
          <span>{{ itineraryDays }}</span>
        </div>
        <div class="flex items-center mt-1">
          <span>Created by {{ creatorName }}</span>
        </div>
      </div>
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
        class="px-4 py-2 text-sm font-medium"
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
            @select-event="$emit('select-event', $event)"
            @edit-event="$emit('edit-event', $event)"
            @delete-event="$emit('delete-event', $event)"
          />
        </div>
      </div>

      <!-- Comments Tab -->
      <div v-if="activeTab === 'comments'" class="h-full bg-blue-100">
        <ItineraryComments :itineraryId="itineraryId" />
      </div>

      <!-- Settings Tab -->
      <div v-if="activeTab === 'settings' && isOwner" class="h-full">
        <ItinerarySettings
          :privacySetting="privacySetting"
          @update:privacySetting="privacySetting = $event"
          @update-privacy="updatePrivacy"
        />
        <div v-if="message" :class="['mt-4 p-4 rounded-md text-center', messageClass]">
          {{ message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchItineraryPrivacy, updateItineraryPrivacy, fetchItineraryWithCreator } from '../../helpers/itinerary';
import ItinerarySettings from './ItinerarySettings.vue';
import ItineraryComments from './ItineraryComments.vue';
import ItineraryEventsList from '../events/ItineraryEventsList.vue';

export default {
  name: 'ItineraryInfo',
  components: {
    ItinerarySettings,
    ItineraryComments,
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
  data() {
    return {
      activeTab: 'details',
      allTabs: [
        { id: 'details', name: 'Details' },
        { id: 'comments', name: 'Comments' },
        { id: 'settings', name: 'Settings', ownerOnly: true }
      ],
      privacySetting: 'private',
      message: '',
      messageClass: '',
      itineraryDays: 0,
      creatorName: '',
      itineraryImgUrl: 'https://via.placeholder.com/150',
    };
  },
  computed: {
    availableTabs() {
      return this.allTabs.filter(tab => !tab.ownerOnly || this.isOwner);
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
        this.message = 'Failed to update privacy settings';
        this.messageClass = 'bg-red-100 text-red-700';
      } else {
        this.message = 'Privacy settings updated successfully';
        this.messageClass = 'bg-green-100 text-green-700';
        setTimeout(() => {
          this.message = '';
        }, 3000);
      }
    }
  }
};
</script>