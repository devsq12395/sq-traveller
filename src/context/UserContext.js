import { reactive } from 'vue';

// Create a reactive user state
const userState = reactive({
  username: null,
  email: null,
  user_id: null,
  
  avatar_url: null,
  bio: null
});

const itineraryState = reactive({
  id: null,
  lastRefresh: 0
});

const eventState = reactive({
  eventId: null,
});

export const eventPopupsState = reactive({
  eventId: null,
  isCreateTodoPopupShow: false,
  isCreateNotePopupShow: false,
  isCreateBudgetPopupShow: false,
  isEventInfoPopupShow: false
});

const loadingState = reactive({
  isLoading: false,
});

const loginPopupState = reactive({
  isLoginPopupShow: false,
});

const cookieState = reactive({
  necessary: true,
  analytics: false,
  preferences: false,
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
  userState.avatar_url = user.avatar_url;
  userState.bio = user.bio;

  // Save user data to local storage
  localStorage.setItem('user', JSON.stringify(user));
}

export function setItinerary(id) {
  itineraryState.id = id;
  itineraryState.lastRefresh = new Date().getTime();
}

export function refreshItinerary() {
  itineraryState.lastRefresh = new Date().getTime();
}

export function setEventId(eventId) {
  eventState.eventId = eventId;
}

// Event popup functions
export function setCreateTodoPopupShow(eventId, isShow) {
  eventPopupsState.eventId = eventId;
  eventPopupsState.isCreateTodoPopupShow = isShow;
}

export function setCreateNotePopupShow(eventId, isShow) {
  eventPopupsState.eventId = eventId;
  eventPopupsState.isCreateNotePopupShow = isShow;
}

export function setCreateBudgetPopupShow(eventId, isShow) {
  eventPopupsState.eventId = eventId;
  eventPopupsState.isCreateBudgetPopupShow = isShow;
}

export function setEventInfoPopupShow(eventId, isShow) {
  eventPopupsState.eventId = eventId;
  eventPopupsState.isEventInfoPopupShow = isShow;
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
  loginPopupState.isLoginPopupShow = show;
}

export function useLoginPopup() {
  return loginPopupState;
}

export function useCookies() {
  return cookieState;
}

export function setCookies(cookies) {
  cookieState.necessary = cookies.necessary;
  cookieState.analytics = cookies.analytics;
  cookieState.preferences = cookies.preferences;

  localStorage.setItem('cookies', JSON.stringify(cookieState));
}

function loadCookiesFromStorage() {
  const storedCookies = JSON.parse(localStorage.getItem('cookies'));
  if (storedCookies) {
    cookieState.necessary = storedCookies.necessary;
    cookieState.analytics = storedCookies.analytics;
    cookieState.preferences = storedCookies.preferences;
  }
}

// Load user data from storage on app initialization
loadUserFromStorage();
loadCookiesFromStorage();
