<template>
  <div class="about-us">
    <AboutPolicies />
  </div>
</template>

<script>
import AboutPolicies from '@/components/about/AboutPolicies.vue';

export default {
  name: 'AboutUsPage',
  components: {
    AboutPolicies
  }
};
</script>

<style scoped>
.about-us {
  padding: 20px;
  text-align: center;
}
</style>
