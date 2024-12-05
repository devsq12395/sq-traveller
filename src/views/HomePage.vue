<template>
  <div class="home">
    <div class="main-section">
      <!-- Adjusted Central Box -->
      <div class="absolute top-1/4 left-1/4 transform -translate-y-1/4 bg-blue-100 bg-opacity-95 shadow-xl p-8 rounded-lg flex flex-col items-center z-30">
        <img 
          src="https://res.cloudinary.com/dkloacrmg/image/upload/v1733400223/sq-traveller/gfuwhjlzhajskvizkufl.png" 
          alt="Logo" 
          class="h-20 mb-5"
        />
        <p class="text-4xl font-bold text-gray-800 mb-4 text-center">Your Adventure Begins Here</p>
        <p class="text-base text-gray-600 mb-6 text-center">Simple and Efficient Itinerary Planner</p>
        <button 
          v-if="!profile" 
          @click="handleLogin" 
          class="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
        >
          Login / Sign up
        </button>
        <router-link 
          v-else 
          to="/dashboard" 
          class="bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
        >
          Go To Dashboard
        </router-link>
      </div>
      
      <!-- Background Image -->
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
  filter: brightness(0.8); /* Slight overlay for readability */
  z-index: 1;
}

.section-divider {
  width: 100%;
  border: none;
  height: 2px;
  background-color: #333;
  margin: 20px 0;
}

button:hover, a:hover {
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
