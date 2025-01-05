<template>
  <div v-if="isDesktop" class="w-full relative">
    <!-- Banner -->
    <div class="w-full h-80 overflow-hidden">
      <img :src="user.banner_url" alt="User Banner" class="w-full h-full object-cover" />
    </div>

    <!-- Avatar and User Info -->
    <div class="absolute top-3/4 left-8 flex items-center">
      <img :src="user.avatar_url" alt="User Avatar" class="w-56 h-56 rounded-full border-4 border-white" />
      <div class="ml-4">
        <h1 class="text-5xl font-semibold mx-10 mt-12 text-left">{{ user.username }}</h1>
        <p class="text-m text-gray-600 mx-10 mt-2 text-left">{{ user.bio || '' }}</p>
      </div>
    </div>
  </div>
  <div v-else class="w-full relative">
    <!-- Banner -->
    <div class="w-full h-40 overflow-hidden">
      <img :src="user.banner_url" alt="User Banner" class="w-full h-full object-cover" />
    </div>

    <!-- Avatar and User Info -->
    <div class="absolute top-3/4 left-8 flex items-center">
      <img :src="user.avatar_url" alt="User Avatar" class="w-32 h-32 rounded-full border-4 border-white" />
      <div class="ml-4">
        <h1 class="text-2xl font-semibold mx-3 mt-8 text-left">{{ user.username }}</h1>
        <p class="text-sm text-gray-600 mx-3 mt-2 text-left">{{ user.bio || 'asdasds' }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';

export default {
  name: 'ProfileHeadline',
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const isDesktop = ref(window.innerWidth >= 640);

    const checkWindowSize = () => {
      isDesktop.value = window.innerWidth >= 640;
    };
    onMounted(() => {
      window.addEventListener('resize', checkWindowSize);
      checkWindowSize();
    });
    onUnmounted(() => {
      window.removeEventListener('resize', checkWindowSize);
    });

    return {
      isDesktop
    };
  },
};
</script>

<style scoped>
</style>
