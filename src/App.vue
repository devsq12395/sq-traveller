<template>
  <div id="app">
    <LoadingScreen />
    <HeaderComponent />
    <router-view></router-view>
    <LoginPopup v-if="loginPopupState.isLoginPopupShow" @close="closeLoginPopup" />
    <CookieConsent />
  </div>
</template>

<script>
import { provide } from 'vue';
import { useUser } from './context/UserContext';
import HeaderComponent from './components/common/HeaderComponent.vue'; 
import LoadingScreen from './components/common/LoadingScreen.vue';
import LoginPopup from './components/auth/LoginPopup.vue';
import CookieConsent from './components/common/CookieConsent.vue';
import { useLoginPopup, setLoginPopupShow } from './context/UserContext';

export default {
  components: {
    HeaderComponent,
    LoadingScreen,
    LoginPopup,
    CookieConsent,
  },
  setup() {
    // Provide user state globally
    provide('user', useUser());

    const loginPopupState = useLoginPopup();
    console.log('Initial loginPopupState:', loginPopupState);

    const closeLoginPopup = () => {
      console.log('Closing login popup');
      setLoginPopupShow(false);
    };

    return {
      loginPopupState,
      closeLoginPopup
    };
  }
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

@media (max-width: 639px) {
  html, body {
    overflow-x: hidden;
  }
}
</style>