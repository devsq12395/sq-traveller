import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/tailwind.css';
import '@fortawesome/fontawesome-free/css/all.css';
import VueGtag from "vue-gtag";

const app = createApp(App);
app.use(router);

app.use(VueGtag, {
  config: { id: "G-LTDB4LD7ZG" }
}, router);

// Warn handler
app.config.warnHandler = () => {
  // Invalid Prop
  //if (msg.includes('Invalid prop')) {
    //return;
  //}

  // console.warn(`[Vue warn]: ${msg}${trace}`);
  return;
};

app.mount('#app');