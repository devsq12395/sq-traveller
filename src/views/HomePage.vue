<template>
  <div class="home">
    <div class="main-section">
      <div class="absolute top-1/4 left-1/4 transform -translate-x-1/4 -translate-y-1/4 bg-blue-100 bg-opacity-50 p-5 rounded-lg flex flex-col items-center z-30">
        <img src="https://via.placeholder.com/200x60?text=Logo" alt="Logo" class="h-15 mb-5" />
        <hr class="w-full border-t-2 border-gray-800 my-5" />
        <p class="text-2xl mb-2">Your Adventure Begins Here</p>
        <p class="text-base text-gray-600 mb-4">Simple and Efficient Itinerary Planner</p>
        <button 
          v-if="!profile" 
          @click="handleLogin" 
          class="bg-blue-500 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          Login / Sign up
        </button>
        <router-link 
          v-else 
          to="/dashboard" 
          class="bg-blue-500 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          Go To Dashboard
        </router-link>
      </div>
      <div class="background-container"></div>
    </div>
    <hr class="section-divider" />
    <SharedItineraries />
  </div>
</template>

<script>
import SharedItineraries from '@/components/itinerary/SharedItineraries.vue'
import { ref, onMounted, watch } from 'vue';
import { getProfileData } from '@/helpers/authService';
import { useUser, setLoginPopupShow } from '@/context/UserContext';

export default {
  name: 'HomePage',
  components: {
    SharedItineraries
  },
  setup() {
    const profile = ref(null);
    const user = useUser();

    const updateProfile = async () => {
      profile.value = await getProfileData();
    };

    const handleLogin = () => {
      setLoginPopupShow(true);
    };

    // Watch for changes in user context
    watch(() => user.user_id, async (newUserId) => {
      if (newUserId) {
        await updateProfile();
      } else {
        profile.value = null;
      }
    });

    onMounted(async () => {
      await updateProfile();
    });

    return {
      profile,
      handleLogin
    };
  }
}
</script>

<style scoped>
.home {
  width: 100%;
  min-height: 100vh;
}

.main-section {
  position: relative;
  height: 100vh;
  width: 100%;
}

.background-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('https://res.cloudinary.com/dkloacrmg/image/upload/v1733373304/sq-traveller/tbein3lvceghcxauhhvu.jpg');
  background-size: cover;
  background-position: center;
  z-index: 1;
}

.section-divider {
  width: 100%;
  border: none;
  height: 2px;
  background-color: #333;
  margin: 20px 0;
}
</style>
