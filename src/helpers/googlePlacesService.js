import axios from 'axios';

const API_KEY = process.env.VUE_APP_GOOGLE_API_KEY;
const PROXY_URL = process.env.VUE_APP_BACKEND_PROXY;

// Fetch place details using place_id
export const fetchPlaceDetails = async (placeId) => {
  const endpoint = `${PROXY_URL}/place/details`;
  const response = await axios.get(endpoint, {
    params: {
      place_id: placeId,
      key: API_KEY,
    },
  });
  console.log('Place Details Response:', response.data.result); // Log the response
  return response.data.result; // Ensure this contains a `photos` array
};

// Fetch place photo URL using the photo reference
export const fetchPlacePhotos = async (photoReference) => {
  try {
    const endpoint = `${PROXY_URL}/place/photo`;
    const url = `${endpoint}?maxwidth=400&photoreference=${photoReference}`;
    console.log("Fetching photo URL:", url); // Log the URL
    return url;
  } catch (error) {
    console.error("Failed to fetch photo URL:", error.message); // Log the error
    return null; // Return null if an error occurs
  }
};

// Fetch autocomplete suggestions
export const fetchAutocompleteSuggestions = async (input) => {
  const endpoint = `${PROXY_URL}/place/autocomplete`;
  const response = await axios.get(endpoint, {
    params: {
      input,
      key: API_KEY,
    },
  });
  return response.data.predictions;
};
