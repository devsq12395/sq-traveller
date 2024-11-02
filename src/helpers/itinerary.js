import { supabase } from './supabaseClient';

// Fetch all itineraries for a specific user
export async function fetchItineraries(user_id) {
  if (!user_id) {
    console.error('User ID is null or undefined');
    return { error: 'User ID is required to fetch itineraries.' };
  }

  const { data, error } = await supabase
    .from('itinerary')
    .select('id, name, description, time_start, time_end')
    .eq('user_id', user_id);

  if (error) {
    console.error('Error fetching itineraries:', error.message);
    return { error };
  }
  return { data };
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