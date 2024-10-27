<template>
  <div class="login-container">
    <h1>Login</h1>
    <form @submit.prevent="handleLogin">
      <input type="email" v-model="email" placeholder="Email" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VUE_APP_SUPABASE_URL;
const supabaseKey = process.env.VUE_APP_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: null
    };
  },
  methods: {
    async handleLogin() {
      const { error } = await supabase.auth.signInWithPassword({
        email: this.email,
        password: this.password
      });
      if (error) {
        this.errorMessage = error.message;
      } else {
        this.errorMessage = null;
      }
    }
  }
};
</script>

<style scoped>
/* Add your CSS styles here */
</style>
