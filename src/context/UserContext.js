import { reactive } from 'vue';

// Create a reactive user state
const userState = reactive({
  username: null,
  email: null,
  user_id: null,
});

const itineraryState = reactive({
  id: null,
});

const eventState = reactive({
  eventId: null,
});

const loadingState = reactive({
  isLoading: false,
});

const loginPopupState = reactive({
  isLoginPopupShow: false,
});

// Initialize user state from local storage
function loadUserFromStorage() {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  if (storedUser) {
    userState.username = storedUser.username;
    userState.email = storedUser.email;
    userState.user_id = storedUser.user_id;
  }
}

// Function to set user data and save to local storage
export function setUser(user) {
  userState.username = user.username;
  userState.email = user.email;
  userState.user_id = user.user_id;

  // Save user data to local storage
  localStorage.setItem('user', JSON.stringify(user));
}

export function setItinerary(id) {
  itineraryState.id = id;
}

export function setEventId(eventId) {
  eventState.eventId = eventId;
}

// Function to clear user data and local storage
export function clearUser() {
  userState.username = null;
  userState.email = null;
  userState.user_id = null;

  // Remove user data from local storage
  localStorage.removeItem('user');
}

// Provide the user and event states to other components
export function useUser() {
  return userState;
}

export function useItinerary() {
  return itineraryState;
}

export function useEvent() {
  return eventState;
}

export function setLoading(isLoading) {
  loadingState.isLoading = isLoading;
}

export function useLoading() {
  return loadingState;
}

export function setLoginPopupShow(show) {
  console.log('Setting login popup show to:', show);
  loginPopupState.isLoginPopupShow = show;
  console.log('Current loginPopupState:', loginPopupState);
}

export function useLoginPopup() {
  return loginPopupState;
}

// Load user data from storage on app initialization
loadUserFromStorage();
