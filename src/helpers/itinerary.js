import { supabase } from './supabaseClient';

// Fetch all itineraries for a specific user
export async function fetchItineraries(user_id) {
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