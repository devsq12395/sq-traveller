import { supabase } from './supabaseClient';

// Create a new event for a specific itinerary
export async function createEvent(itinerary_id, { location, description, day }) {
  const { data, error } = await supabase.from('event').insert({
    itinerary_id,
    location,
    description,
    day
  }).select();

  if (error) {
    console.error('Error creating event:', error.message);
    return { data: null, error };
  }
  return { data, error: null };
}

// Fetch events for a specific itinerary
export async function fetchItineraryEvents(itinerary_id) {
  if (!itinerary_id) {
    console.error('Itinerary ID is null or undefined');
    return { error: 'Itinerary ID is required to fetch events.' };
  }

  const { data, error } = await supabase
    .from('event')
    .select(`
        id, location, description, day,
        itinerary (name), 
        event_img (img_url)
    `)
    .eq('itinerary_id', itinerary_id);

  if (error) {
    console.error('Error fetching events:', error.message);
    return { error };
  }

  const flattenedData = data.map(event => {
    const img_url = event.event_img?.length ? event.event_img[0].img_url : 'https://via.placeholder.com/150';
    return {
      ...event,
      img_url,
      itinerary_name: event.itinerary?.name || 'Unnamed Itinerary',
    };
  });

  return { data: flattenedData };
}

// Fetch a single event by ID
export async function fetchEvent(eventId) {
  if (!eventId) {
    console.error('Event ID is null or undefined');
    return { error: 'Event ID is required to fetch the event.' };
  }

  const { data, error } = await supabase
    .from('event')
    .select(`
      id, location, description, day,
      event_img (img_url)
    `)
    .eq('id', eventId)
    .single();

  if (error) {
    console.error('Error fetching event:', error.message);
    return { error };
  }

  const img_url = data.event_img?.length ? data.event_img[0].img_url : 'https://via.placeholder.com/150';
  return { data: { ...data, img_url } };
}

// Save the image URL to the event_img table
export async function saveEventImage(eventId, imgUrl) {
  try {
    const { data, error } = await supabase
      .from('event_img')
      .insert({
        event_id: eventId,
        img_url: imgUrl,
      });

    if (error) throw error;
    return { data };
  } catch (error) {
    console.error('Error saving event image:', error.message);
    return { error };
  }
}

// Update an existing event
export async function updateEvent(eventId, updatedEventData) {
  if (!eventId) {
    console.error('Event ID is null or undefined');
    return { error: 'Event ID is required to update the event.' };
  }

  const { data, error } = await supabase
    .from('event')
    .update(updatedEventData)
    .eq('id', eventId)
    .select();

  if (error) {
    console.error('Error updating event:', error.message);
    return { data: null, error };
  }

  return { data, error: null };
}
