import axios from 'axios';

const API_KEY = process.env.VUE_APP_GOOGLE_API_KEY;
const PROXY_URL = process.env.VUE_APP_BACKEND_PROXY;

export const fetchPlaceDetails = async (placeId) => {
  const endpoint = `https://maps.googleapis.com/maps/api/place/details/json`;
  const response = await axios.get(endpoint, {
    params: {
      place_id: placeId,
      key: API_KEY,
    },
  });
  return response.data;
};

export const fetchPlacePhotos = async (photoReference) => {
  const endpoint = `${PROXY_URL}/place/photo`;
  const url = `${endpoint}?maxwidth=400&photoreference=${photoReference}&key=${API_KEY}`;
  return url; // Return the URL to use in <img src="">
};

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
