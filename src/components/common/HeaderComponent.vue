<template>
  <header v-if="isDesktop" class="fixed w-screen bg-blue-100 shadow-md z-40 max-w-screen">
    <div class="container mx-auto px-4 py-3">
      <div class="flex justify-between items-center">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-2">
          <img src="https://res.cloudinary.com/dkloacrmg/image/upload/v1733400223/sq-traveller/gfuwhjlzhajskvizkufl.png" alt="Logo" class="h-16 w-40"/>
        </router-link>

        <!-- Navigation Links -->
        <nav class="flex-1 flex justify-center items-end space-x-4 w-1/2 h-full">
          <router-link to="/" class="w-1/5 h-full flex items-end justify-center text-xl text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg transition-colors nav-link">
            Home
          </router-link>
          <router-link to="/browse" class="w-1/5 h-full flex items-end justify-center text-xl text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg transition-colors nav-link">
            Browse
          </router-link>
          <router-link to="/dashboard" class="w-1/5 h-full flex items-end justify-center text-xl text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg transition-colors nav-link">
            Create
          </router-link>
          <router-link to="/about" class="w-1/5 h-full flex items-end justify-center text-xl text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg transition-colors nav-link">
            About
          </router-link>
        </nav>
        
        <!-- Profile -->
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
              <!-- <router-link 
                to="/settings"
                class="block w-full text-left px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                @click="isMenuOpen = false"
              >
                Settings
              </router-link> -->
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
    </div>
  </header>
  <header v-else class="fixed w-screen bg-blue-200 shadow-md z-40 max-w-screen">
    <div class="container mx-auto px-4 py-3">
      <div class="flex justify-between items-center">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-2">
          <img src="https://res.cloudinary.com/dkloacrmg/image/upload/v1733400223/sq-traveller/gfuwhjlzhajskvizkufl.png" alt="Logo" class="h-16 w-40"/>
        </router-link>

        <!-- Header Drawer Toggle Button -->
        <button @click="isDrawerOpen = !isDrawerOpen" class="text-gray-600 hover:text-gray-800">
          <span class="text-xl">☰</span>
        </button>

        <!-- Header Drawer -->
        <transition name="slide-fade">
          <div v-if="isDrawerOpen" class="fixed inset-0 z-50" @click.self="isDrawerOpen = false">
            <div class="bg-blue-100 w-64 h-full shadow-lg fixed right-0">
              <nav class="flex flex-col p-4 space-y-2">
                <router-link to="/" class="text-xl text-gray-600 hover:text-gray-800" @click="closeDrawer">
                  Home
                </router-link>
                <router-link to="/browse" class="text-xl text-gray-600 hover:text-gray-800" @click="closeDrawer">
                  Browse
                </router-link>
                <router-link to="/dashboard" class="text-xl text-gray-600 hover:text-gray-800" @click="closeDrawer">
                  Create
                </router-link>
                <router-link to="/about" class="text-xl text-gray-600 hover:text-gray-800" @click="closeDrawer">
                  About
                </router-link>
                <div v-if="!profile">
                  <button @click="handleLogin" class="text-xl text-gray-600 hover:text-gray-800">
                    Login
                  </button>
                </div>
                <div v-else class="flex flex-col p-4 space-y-2">
                  <!-- <button @click="handleSettings" class="text-xl text-gray-600 hover:text-gray-800">
                    Settings
                  </button> -->
                  <button @click="handleLogout" class="text-xl text-gray-600 hover:text-gray-800">
                    Logout
                  </button>
                </div>
              </nav>
            </div>
          </div>
        </transition>
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
    const isDrawerOpen = ref(false);
    const user = useUser();
    const isDesktop = ref(window.innerWidth >= 640);
    const username = ref('your-username-here');

    const updateProfile = async () => {
      if (route.name !== 'SetUsernamePage') {
        const { hasProfile, error } = await getUserHasProfile();
        let hasUserLogin = false;

        if (error) {
          console.error('Error checking user profile:', error.message);
        } else if (!hasProfile) {
          router.push('/set-username'); // Redirect to SetUsernamePage if no profile
        } else {
          const { data: getUser } = await supabase.auth.getUser();
          profile.value = await getProfileData();

          setUser({
            username: profile.value.username,
            email: getUser.user.email,
            user_id: getUser.user.id,
            avatar_url: profile.value.avatar_url,
            bio: profile.value.bio
          });
          hasUserLogin = true;
        }

        if (!hasUserLogin) {
          setUser({
            username: '',
            email: '',
            user_id: '',
            avatar_url: '',
            bio: ''
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
        if (!isDesktop.value && isDrawerOpen.value) closeDrawer();
      } catch (error) {
        console.error('Error logging out:', error.message);
      }
    };

    const handleLogin = () => {
      setLoginPopupShow(true);
      if (!isDesktop.value && isDrawerOpen.value) closeDrawer();
    };

    const handleSettings = () => {
      router.push('/settings');
      if (!isDesktop.value && isDrawerOpen.value) closeDrawer();
    };

    const closeDrawer = () => {
      isDrawerOpen.value = false;
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
      handleSettings,
      profile,
      isMenuOpen,
      isDrawerOpen,
      isDesktop,
      username,
      closeDrawer
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

  .nav-link {
    position: relative;
    overflow: hidden;
  }

  .nav-link::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 3px;
    bottom: 0;
    left: 0;
    background-color: #3490dc; /* Blue color */
    visibility: hidden;
    transform: scaleX(0);
    transition: all 0.3s ease-in-out;
  }

  .nav-link:hover::before {
    visibility: visible;
    transform: scaleX(1);
  }
}

.router-link-active {
  border-bottom: 2px solid black;
}

nav a {
  position: relative;
  overflow: hidden;
}

nav a::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

nav a:hover::after {
  transform: scaleX(1);
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>