import { reactive } from 'vue';

// Create a reactive user state
const userState = reactive({
  username: null,
  email: null,
  user_id: null,
});

// Function to set user data
export function setUser(user) {
  userState.username = user.username;
  userState.email = user.email;
  userState.user_id = user.user_id;
}

// Function to clear user data
export function clearUser() {
  userState.username = null;
  userState.email = null;
  userState.user_id = null;
}

// Provide the user state to other components
export function useUser() {
  return userState;
}
