<template>
  <div class="profile-page flex flex-col items-center">
    <ProfileHeadline :user="user" />
    <ProfileItineraries :itineraries="itineraries" />
  </div>
</template>

<script>
import ProfileHeadline from '../profile/ProfileHeadline.vue';
import ProfileItineraries from '../profile/ProfileItineraries.vue';
import { getUserDetails } from '../../helpers/profile';
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
      itineraries: [],
    };
  },
  async created() {
    const route = useRoute();
    const username = route.params.username;
    this.user = await getUserDetails(username);
    if (this.user) {
      this.itineraries = this.user.itineraries.filter(itinerary => itinerary.shared);
    }
  },
};
</script>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
