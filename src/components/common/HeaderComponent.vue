<template>
  <header class="fixed w-screen bg-blue-200 shadow-md z-40 max-w-screen">
    <div class="container mx-auto px-4 py-3">
      <div v-if="isDesktop" class="flex justify-between items-center">
        <router-link to="/" class="flex items-center space-x-2">
          <img src="https://res.cloudinary.com/dkloacrmg/image/upload/v1733400223/sq-traveller/gfuwhjlzhajskvizkufl.png" alt="Logo" class="h-16 w-40"/>
        </router-link>
        
        <div class="flex items-center space-x-4">
          <div v-if="profile" class="flex items-center space-x-2">
            <img v-if="profile.avatar_url" :src="profile.avatar_url" alt="Avatar" class="h-10 w-10 rounded-full"/>
            <router-link :to="`/user/${profile.username}`" class="text-gray-600">
              Welcome, {{ profile.username }}
            </router-link>
          </div>
          <div class="relative">
            <button 
              v-if="profile"
              @click="isMenuOpen = !isMenuOpen"
              class="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span class="text-xl">&#8230;</span>
            </button>
            
            <button 
              v-else
              @click="handleLogin"
              class="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Login
            </button>
            
            <div v-if="isMenuOpen && profile" 
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
            >
              <router-link 
                to="/settings"
                class="block w-full text-left px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                @click="isMenuOpen = false"
              >
                Settings
              </router-link>
              <button 
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="flex justify-between items-center">
        <router-link to="/" class="flex items-center space-x-2">
          <img src="https://res.cloudinary.com/dkloacrmg/image/upload/v1733400223/sq-traveller/gfuwhjlzhajskvizkufl.png" alt="Logo" class="h-8 w-20"/>
        </router-link>
        
        <div class="flex items-center space-x-2">
          <div v-if="profile" class="flex items-center space-x-2">
            <img v-if="profile.avatar_url" :src="profile.avatar_url" alt="Avatar" class="h-8 w-8 rounded-full"/>
            <router-link :to="`/user/${profile.username}`" class="text-gray-600 text-sm">
              Welcome, {{ profile.username }}
            </router-link>
          </div>
          <div class="relative">
            <button 
              v-if="profile"
              @click="isMenuOpen = !isMenuOpen"
              class="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span class="text-lg">&#8230;</span>
            </button>
            
            <button 
              v-else
              @click="handleLogin"
              class="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Login
            </button>
            
            <div v-if="isMenuOpen && profile" 
              class="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-2 z-50"
            >
              <router-link 
                to="/settings"
                class="block w-full text-left px-3 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                @click="isMenuOpen = false"
              >
                Settings
              </router-link>
              <button 
                @click="handleLogout"
                class="block w-full text-left px-3 py-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { supabase } from '../../helpers/supabaseClient';
import { useRouter, useRoute } from 'vue-router';
import { ref, onMounted, watch } from 'vue';
import { getProfileData, logout, getUserHasProfile } from '../../helpers/authService';
import { setUser, useUser, setLoginPopupShow } from '../../context/UserContext';

export default {
  name: 'AppHeader',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const profile = ref(null);
    const isMenuOpen = ref(false);
    const user = useUser();
    const isDesktop = ref(window.innerWidth >= 640);
    const username = ref('your-username-here');

    const updateProfile = async () => {
      if (route.name !== 'SetUsernamePage') {
        const { hasProfile, error } = await getUserHasProfile();

        if (error) {
          console.error('Error checking user profile:', error.message);
        } else if (!hasProfile) {
          router.push('/set-username'); // Redirect to SetUsernamePage if no profile
        } else {
          const { data: getUser } = await supabase.auth.getUser();
          console.log ('Current user:', getUser);
          profile.value = await getProfileData();

          setUser({
            username: profile.value.username,
            email: getUser.user.email,
            user_id: getUser.user.id,
            avatar_url: profile.value.avatar_url,
            bio: profile.value.bio
          });
        }
      }
    };

    const handleLogout = async () => {
      try {
        const error = await logout();
        if (error) throw error;
        isMenuOpen.value = false;
        router.push('/');
      } catch (error) {
        console.error('Error logging out:', error.message);
      }
    };

    const handleLogin = () => {
      console.log('handleLogin clicked');
      setLoginPopupShow(true);
      console.log('LoginPopup state set to true');
    };

    // Watch for changes in user context
    watch(() => user.user_id, async (newUserId) => {
      if (newUserId) {
        await updateProfile();
      } else {
        profile.value = null;
      }
    });

    // Watch for window resize
    window.addEventListener('resize', () => {
      isDesktop.value = window.innerWidth >= 640;
    });

    onMounted(async () => {
      await updateProfile();
    });

    return {
      handleLogout,
      handleLogin,
      profile,
      isMenuOpen,
      isDesktop,
      username
    };
  }
};
</script>

<style scoped>
/* Add click-away behavior for the dropdown */
@media (min-width: 640px) {
  .relative:focus-within > div {
    display: block;
  }
}
</style>