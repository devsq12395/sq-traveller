import { supabase } from './supabaseClient';

// Fetch all itineraries for a specific user
export async function fetchItineraries(user_id) {
  if (!user_id) {
    console.error('User ID is null or undefined');
    return { error: 'User ID is required to fetch itineraries.' };
  }

  const { data, error } = await supabase
    .from('itinerary')
    .select('id, name, description, time_start, time_end, itinerary_img(img_url)')
    .eq('user_id', user_id);

  if (error) {
    console.error('Error fetching itineraries:', error.message);
    return { error };
  }

  // Adjust time fields and handle nested `itinerary_img` data
  const adjustedData = data.map(itinerary => ({
    ...itinerary,
    img_url: itinerary.itinerary_img?.img_url || 'https://via.placeholder.com/150',
  }));

  return { data: adjustedData };
}

// Create a new event for a specific itinerary
export async function createEvent(itinerary_id, { location, description, time_start, time_end }) {
  const { error } = await supabase.from('event').insert({
    itinerary_id,
    location,
    description,
    time_start,
    time_end,
  });

  if (error) {
    console.error('Error creating event:', error.message);
    return { error };
  }
  return { error: null };
}

// Create a new itinerary
export async function createItinerary(userId, name, description, timeStart, timeEnd) {
  try {
    const { data, error } = await supabase
      .from('itinerary')
      .insert({
        user_id: userId,
        name,
        description,
        time_start: timeStart,
        time_end: timeEnd,
      });

    if (error) {
      console.error('Error creating itinerary:', error.message);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error:', err.message);
    return { data: null, error: err.message };
  }
}


// Save the image URL to the itinerary_img table
export async function saveItineraryImage(itineraryId, imgUrl) {
  try {
    const { data, error } = await supabase
      .from('itinerary_img')
      .insert({
        itinerary_id: itineraryId,
        img_url: imgUrl,
      });

    if (error) throw error;
    return { data };
  } catch (error) {
    console.error('Error saving itinerary image:', error.message);
    return { error };
  }
}

// Fetch events for a specific itinerary
export async function fetchItineraryEvents(itinerary_id) {
  const { data, error } = await supabase
    .from('event')
    .select('id, location, time_start, time_end, description, itinerary:itinerary(name)')
    .eq('itinerary_id', itinerary_id);

  if (error) {
    console.error('Error fetching events:', error.message);
    return { error };
  }
  
  const flattenedData = data.map(({ itinerary, ...event }) => ({
    ...event,
    itinerary_name: itinerary.name, // Add itinerary name as a string
  }));

  return { data: flattenedData };
}