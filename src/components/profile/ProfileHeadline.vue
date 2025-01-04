<template>
  <div class="profile-headline flex flex-col items-center w-1/3 h-1/3">
    <img :src="user.avatar" alt="User Avatar" class="avatar w-24 h-24 rounded-full"/>
    <h1 class="text-lg font-semibold mt-2">{{ user.username }}</h1>
    <p class="text-sm text-gray-600">{{ user.bio }}</p>
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
