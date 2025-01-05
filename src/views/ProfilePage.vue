<template>
  <div class="profile-page flex flex-row items-center">
    <div class="mt-20 flex flex-col mx-auto bg-blue-100 rounded-lg w-[90%] p-5 min-h-screen">
      <!-- Profile Headline -->
      <ProfileHeadline :user="user" />

      <!-- Profile Contents -->
      <div class="profile-contents w-full bg-cyan-100 rounded-lg flex flex-col items-center mt-40">
        <!-- Tabs Section -->
        <!-- Will comment out for now-->
        <!-- <div class="flex border-b border-gray-300 w-full">
          <button
            v-for="tab in tabs"
            :key="tab"
            @click="currentTab = tab"
            :class="{
              'border-b-2 border-blue-500 text-blue-600': currentTab === tab,
              'hover:text-blue-500': true
            }"
            class="flex-1 px-6 py-2 text-center text-sm font-medium text-gray-600 w-1/4"
          >
            {{ tab }}
          </button>
        </div> -->

        <!-- Current Tab Component -->
        <div class="mt-4 w-full h-1/2">
          <component 
            :is="currentTabComponent" 
            ref="currentTabComponentRef"
            :user="user" 
            :itineraries="sharedItineraries" 
          />
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import ProfileHeadline from '../components/profile/ProfileHeadline.vue';
import ProfileItineraries from '../components/profile/ProfileItineraries.vue';
import { getUserDetails } from '../helpers/profile';
import { getAllsharedItinerariesOfUser } from '../helpers/itinerary';
import { useRoute } from 'vue-router';

export default {
  name: 'ProfilePage',
  components: {
    ProfileHeadline,
    ProfileItineraries,
  },
  data() {
    return {
      user: {},
      sharedItineraries: [],
    };
  },
  setup() {
    const tabs = ['Itineraries', 'Following'];
    const currentTab = ref('Itineraries');

    const currentTabComponent = computed(() => {
      switch (currentTab.value) {
        case 'Following':
          return ProfileItineraries;
        default:
          return ProfileItineraries;
      }
    });

    return {
      tabs,
      currentTab,
      currentTabComponent
    };
  },
  async created() {
    const route = useRoute();
    const username = route.params.username;
    this.user = await getUserDetails(username);

    const { data: itineraries, error } = await getAllsharedItinerariesOfUser(this.user.user_id);
    if (!error) {
      this.sharedItineraries = itineraries;
      console.log ('Shared itineraries:', this.sharedItineraries);
    } else {
      console.error('Error fetching shared itineraries:', error.message);
    }
  },
};
</script>

<style scoped>

</style>
