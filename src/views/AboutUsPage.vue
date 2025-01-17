<template>
  <div class="about-us">
    <AboutUs />
    <AboutPolicies />
  </div>
</template>

<script>
import AboutPolicies from '@/components/about/AboutPolicies.vue';
import AboutUs from '@/components/about/AboutUs.vue';

export default {
  name: 'AboutUsPage',
  components: {
    AboutPolicies,
    AboutUs
  }
};
</script>

<style scoped>
.about-us {
  padding: 20px;
  text-align: center;
}
</style>
