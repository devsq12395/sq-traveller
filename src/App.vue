<template>
  <HeaderComponent />
  <router-view />
</template>

<script>
import { provide } from 'vue';
import { useUser } from './context/UserContext';
import HeaderComponent from './components/common/Header.vue'; 

export default {
  components: {
    HeaderComponent,
  },
  setup() {
    // Provide user state globally
    provide('user', useUser());
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>