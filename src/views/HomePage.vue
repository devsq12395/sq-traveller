<template>
  <div v-if="isDesktop" class="w-full min-h-screen">
    <div class="relative w-full">
      <!-- Opening Screen Contents -->
      <div class="flex justify-center items-center pt-20">
        <!-- Background Image -->
        <div class="absolute inset-0 bg-cover bg-center h-[2/3]" style="background-image: url('https://res.cloudinary.com/dkloacrmg/image/upload/v1733373304/sq-traveller/tbein3lvceghcxauhhvu.jpg'); filter: brightness(0.8);"></div>

        <!-- Central Box -->
        <div class="bg-white p-10 rounded shadow-lg w-2/3 bg-opacity-95 shadow-xl flex flex-col items-start z-30 transition-opacity duration-500 opacity-0 mr-10 mt-20 mb-20" :class="{'opacity-100': boxVisible}">
          <!-- Logo -->
          <div class="flex justify-center w-full">
            <img 
              src="https://res.cloudinary.com/dkloacrmg/image/upload/v1733400223/sq-traveller/gfuwhjlzhajskvizkufl.png" 
              alt="Logo" 
              class="h-20 mb-5"
            />
          </div>
          
          <!-- Subtitles -->
          <div  class="flex flex-col gap-2 text-5xl font-bold text-gray-800 mb-4 text-left transition-opacity duration-500 opacity-0 delay-500" 
                style="font-family: 'Raleway', sans-serif; font-weight: 200;" :class="{'opacity-100': subtitleVisible}">
            <p>Create Informative Itineraries</p>
            <p>in just a few clicks</p>
          </div>

          <hr class="my-6 w-full border-gray-300 transition-opacity duration-1000 opacity-0 delay-1000" :class="{'opacity-100': restVisible}" />

          <!-- Bullet Points -->
          <ul class="text-base text-xl text-gray-600 mb-6 text-left list-none pl-8 transition-opacity duration-500 opacity-0 delay-1000" :class="{'opacity-100': restVisible}">
            <li class="flex items-center mb-2">
              <i class="material-icons text-blue-500 mr-2">play_arrow</i>
              Clean, Simple and Efficient Itinerary Planner
            </li>
            <li class="flex items-center mb-2">
              <i class="material-icons text-blue-500 mr-2">play_arrow</i>
              Plan out your trip budget
            </li>
            <li class="flex items-center mb-2">
              <i class="material-icons text-blue-500 mr-2">play_arrow</i>
              Browse other users' itineraries
            </li>
          </ul>
          
          <div class="flex justify-center w-full transition-opacity duration-1000 opacity-0 delay-1000" :class="{'opacity-100': restVisible}">
            <button 
              v-if="!profile" 
              @click="handleLogin" 
              class="bg-blue-500 text-white px-6 py-3 rounded hover:shadow-lg"
            >
              Login / Sign up
            </button>
            <router-link 
              v-else 
              to="/dashboard" 
              class="bg-blue-500 text-white px-6 py-3 rounded hover:shadow-lg"
            >
              Go To Dashboard
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <hr class="w-full border-gray-300 my-6" />

    <!-- Bottom Section -->
    <div class="flex justify-between items-stretch mb-4 gap-0 px-6">
      <FeaturedItineraries />
      <SharedItineraries 
        :numOfRows="1"
      />
    </div>
  </div>
  <div v-else class="w-full min-h-screen">
    <div class="relative h-screen w-full">
      <!-- Adjusted Central Box -->
      <div class="absolute top-1/3 transform -translate-y-1/4 bg-blue-100 bg-opacity-85 shadow-xl p-8 rounded-lg flex flex-col items-center z-30 transition-opacity duration-1000 opacity-0" :class="{'opacity-100': boxVisible}">
        <!-- Logo -->
        <div class="flex justify-center w-full">
          <img 
            src="https://res.cloudinary.com/dkloacrmg/image/upload/v1733400223/sq-traveller/gfuwhjlzhajskvizkufl.png" 
            alt="Logo" 
            class="h-20 mb-5"
          />
        </div>

        <!-- Subtitles -->
        <div  class="flex flex-col gap-2 text-3xl font-bold text-gray-800 mb-4 text-left transition-opacity duration-1000 opacity-0 delay-500" 
              style="font-family: 'Raleway', sans-serif; font-weight: 200;" :class="{'opacity-100': subtitleVisible}">
          <p>Create Informative Itineraries</p>
          <p>in just a few clicks</p>
        </div>
        
        <!-- Horizontal Line -->
        <hr class="my-6 w-full border-gray-300 transition-opacity duration-1000 opacity-0 delay-1000" :class="{'opacity-100': restVisible}" />

        <!-- Bullet Points -->
        <ul class="text-base text-m text-gray-600 mb-6 text-left list-none pl-8 transition-opacity duration-1000 opacity-0 delay-1000" :class="{'opacity-100': restVisible}">
          <li class="flex items-center mb-2">
            <i class="material-icons text-blue-500 mr-2">play_arrow</i>
            Clean, Simple and Efficient Itinerary Planner
          </li>
          <li class="flex items-center mb-2">
            <i class="material-icons text-blue-500 mr-2">play_arrow</i>
            Plan out your trip details (budget, activities, noted, etc.)
          </li>
          <li class="flex items-center mb-2">
            <i class="material-icons text-blue-500 mr-2">play_arrow</i>
            Browse other users' itineraries
          </li>
        </ul>
        
        <button 
          v-if="!profile" 
          @click="handleLogin" 
          class="bg-blue-500 text-white px-6 py-3 rounded hover:shadow-lg transition-opacity duration-1000 opacity-0 delay-1000" :class="{'opacity-100': restVisible}"
        >
          Login / Sign up
        </button>
        <router-link 
          v-else 
          to="/dashboard" 
          class="bg-blue-500 text-white px-6 py-3 rounded hover:shadow-lg transition-opacity duration-1000 opacity-0 delay-1000" :class="{'opacity-100': restVisible}"
        >
          Go To Dashboard
        </router-link>
      </div>
      <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('https://res.cloudinary.com/dkloacrmg/image/upload/v1733373304/sq-traveller/tbein3lvceghcxauhhvu.jpg'); filter: brightness(0.8);"></div>
    </div>
    <hr class="w-full border-gray-300 my-6" />

    <div class="flex flex-col items-stretch mb-4 gap-0 px-2 gap-4">
      <FeaturedItineraries :widthPercentage="'100%'" />
      <hr class="w-full border-gray-300 my-6" />
      <SharedItineraries />
    </div>
  </div>
</template>

<script>
import SharedItineraries from '@/components/itinerary/SharedItineraries.vue';
import FeaturedItineraries from '@/components/browse/featured-itineraries/FeaturedItineraries.vue';
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { getProfileData } from '@/helpers/authService';
import { useUser, setLoginPopupShow } from '@/context/UserContext';

export default {
  name: 'HomePage',
  components: {
    SharedItineraries,
    FeaturedItineraries
  },
  setup() {
    const profile = ref(null);
    const user = useUser();
    const isDesktop = ref(window.innerWidth >= 640);

    const boxVisible = ref(false);
    const subtitleVisible = ref(false);
    const restVisible = ref(false);

    const checkWindowSize = () => {
      isDesktop.value = window.innerWidth >= 640;
    };

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
      window.addEventListener('resize', checkWindowSize);

      setTimeout(() => {
        boxVisible.value = true;
      }, 500);

      setTimeout(() => {
        subtitleVisible.value = true;
      }, 1000);

      setTimeout(() => {
        restVisible.value = true;
      }, 1500);
    });
    onUnmounted(() => {
      window.removeEventListener('resize', checkWindowSize);
    });

    return {
      profile,
      handleLogin,
      isDesktop,
      boxVisible,
      subtitleVisible,
      restVisible
    };
  }
}
</script>

<style scoped>
button:hover, a:hover {
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
