<template>
  <header class="fixed w-full bg-white shadow-md z-50">
    <div class="container mx-auto px-4 py-3">
      <div class="flex justify-between items-center">
        <router-link to="/dashboard" class="text-xl font-bold text-gray-800">
          SQ Traveller
        </router-link>
        
        <div class="flex items-center space-x-4">
          <span v-if="profile" class="text-gray-600">
            Welcome, {{ profile.username }}
          </span>
          <div class="relative">
            <button 
              @click="isMenuOpen = !isMenuOpen"
              class="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span class="text-xl">&#8230;</span>
            </button>
            
            <div v-if="isMenuOpen" 
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
    </div>
  </header>
</template>

<script>
import { useRouter } from 'vue-router';
import { supabase } from '../../helpers/supabaseClient';
import { ref, onMounted } from 'vue';
import { getProfileData } from '../../helpers/authService';

export default {
  name: 'AppHeader',
  setup() {
    const router = useRouter();
    const profile = ref(null);
    const isMenuOpen = ref(false);

    const handleLogout = async () => {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        router.push('/');
      } catch (error) {
        console.error('Error logging out:', error.message);
      }
    };

    onMounted(async () => {
      profile.value = await getProfileData();
    });

    return {
      handleLogout,
      profile,
      isMenuOpen
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