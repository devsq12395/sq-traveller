<template>
    <div class="mb-4">
      <p class="text-left" v-html="description.replace(/\n/g, '<br>')"></p>
    </div>
  </template>

<script>
export default {
  name: 'EventDescription',
  props: {
    eventId: {
      type: String,
      required: true,
    },
    isOwner: {
      type: Boolean,
      default: false
    },
    description: {
      type: String,
      default: ''
    }
  }
};
</script>

<style scoped>
/* Additional styles if needed */
</style>