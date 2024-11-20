<template>
  <div class="header flex justify-end p-4 bg-gray-100 shadow-md">
    <span v-if="isLoggedIn" class="text-gray-800 font-semibold">Welcome, {{ userName }}</span>
    <button v-else @click="goToLogin" class="text-blue-500 font-semibold">Login</button>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useUser } from '../../context/UserContext';
import { useRouter } from 'vue-router';

export default {
  name: 'HeaderComponent',
  setup() {
    const { user } = useUser();
    const userName = ref(user ? user.name : 'Guest');
    const isLoggedIn = ref(!!user);

    const goToLogin = () => {
      const router = useRouter();
      router.push('/login');
    };

    return {
      userName,
      isLoggedIn,
      goToLogin,
    };
  },
};
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  background-color: rgba(150, 150, 255, 0.5);
}
</style>
