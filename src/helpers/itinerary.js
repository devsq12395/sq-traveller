import { supabase } from './supabaseClient';

// Fetch all itineraries for a specific user
export async function fetchItineraries(user_id) {
  if (!user_id) {
    console.error('User ID is null or undefined');
    return { error: 'User ID is required to fetch itineraries.' };
  }

  // Fetch itineraries and join with the itinerary_img table
  const { data, error } = await supabase
    .from('itinerary')
    .select(`
      id, name, description, time_start, time_end,
      itinerary_img (img_url)
    `)
    .eq('user_id', user_id);

  if (error) {
    console.error('Error fetching itineraries:', error.message);
    return { error };
  }

  // Adjust time fields and handle nested itinerary_img data
  const adjustedData = data.map(itinerary => {
    // Access the first img_url from the itinerary_img array or use the placeholder
    const img_url = itinerary.itinerary_img?.length ? itinerary.itinerary_img[0].img_url : 'https://via.placeholder.com/150';
    return {
      ...itinerary,
      img_url,
    };
  });

  return { data: adjustedData };
}

// Fetch a single itinerary by ID
export async function fetchItinerary(itineraryId) {
  if (!itineraryId) {
    console.error('Itinerary ID is null or undefined');
    return { error: 'Itinerary ID is required to fetch the itinerary.' };
  }

  // Fetch the itinerary and join with the itinerary_img table
  const { data, error } = await supabase
    .from('itinerary')
    .select(`
      id, name, description, time_start, time_end,
      itinerary_img (img_url)
    `)
    .eq('id', itineraryId)
    .single();

  if (error) {
    console.error('Error fetching itinerary:', error.message);
    return { error };
  }

  // Access the first img_url from the itinerary_img or use the placeholder
  const img_url = data.itinerary_img?.length ? data.itinerary_img[0].img_url : 'https://via.placeholder.com/150';
  const adjustedData = { ...data, img_url };

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
    // Extract only the time portion from the provided ISO strings
    const startTime = new Date(timeStart).toISOString();
    const endTime = new Date(timeEnd).toISOString();

    console.log (`${startTime}, ${endTime}`);

    const { data, error } = await supabase
      .from('itinerary')
      .insert({
        user_id: userId,
        name,
        description,
        time_start: startTime,
        time_end: endTime,
      })
      .select();

    if (error) {
      console.error('Error creating itinerary in Supabase:', error.message);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error in createItinerary:', err.message);
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