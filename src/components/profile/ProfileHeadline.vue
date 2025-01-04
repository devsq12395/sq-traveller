<template>
  <div class="w-full relative">
    <!-- Banner -->
    <div class="w-full h-80 overflow-hidden">
      <img :src="user.banner_url" alt="User Banner" class="w-full h-full object-cover" />
    </div>

    <!-- Avatar and User Info -->
    <div class="absolute top-3/4 left-8 flex items-center">
      <img :src="user.avatar_url" alt="User Avatar" class="w-56 h-56 rounded-full border-4 border-white" />
      <div class="ml-4">
        <h1 class="text-4xl font-semibold mx-10 mt-12 text-left">{{ user.username }}</h1>
        <p class="text-m text-gray-600 mx-10 mt-2 text-left">{{ user.bio || '' }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfileHeadline',
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
</style>
