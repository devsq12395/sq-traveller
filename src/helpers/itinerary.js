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

// Create a new itinerary
export async function createItinerary(user_id, name, description, time_start, time_end) {
    const formattedTimeStart = extractTime(time_start);
    const formattedTimeEnd = extractTime(time_end);

    const { error } = await supabase.from('itinerary').insert({
        user_id,
        name,
        description,
        time_start: formattedTimeStart,
        time_end: formattedTimeEnd,
    });

    if (error) {
        console.error('Error creating itinerary:', error.message);
        return { error };
    }
    return { error: null };
}

// Helper to extract time from datetime string
function extractTime(datetime) {
    return datetime ? datetime.split('T')[1] : null; // Extracts only the time part
}

// Fetch events for a specific itinerary
export async function fetchItineraryEvents(itinerary_id) {
  const { data, error } = await supabase
    .from('event')
    .select('id, location, time_start, time_end, description, itinerary_name:itinerary(name)')
    .eq('itinerary_id', itinerary_id);

  if (error) {
    console.error('Error fetching events:', error.message);
    return { error };
  }
  return { data };
}