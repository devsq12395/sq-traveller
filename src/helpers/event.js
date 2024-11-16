import { supabase } from './supabaseClient';

// Create a new event for a specific itinerary
export async function createEvent(itinerary_id, { location, description, time_start, time_end }) {
    const { data, error } = await supabase.from('event').insert({
        itinerary_id,
        location,
        description,
        time_start,
        time_end,
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
            id, location, time_start, time_end, description, 
            itinerary (name), 
            event_img (img_url)
        `)
        .eq('itinerary_id', itinerary_id);

    if (error) {
        console.error('Error fetching events:', error.message);
        return { error };
    }

    const flattenedData = data.map(event => {
        // Access the img_url from the event_img array or use the placeholder
        const img_url = event.event_img?.length ? event.event_img[0].img_url : 'https://via.placeholder.com/150';

        return {
            ...event,
            img_url,
            itinerary_name: event.itinerary?.name || 'Unnamed Itinerary', // Add itinerary name or a default
        };
    });

    return { data: flattenedData };
}

// Fetch a single event by ID
export async function fetchEvent(eventId) {
    if (!eventId) {
      console.error('Event ID is null or undefined');
      return { error: 'Event ID is required to fetch the itinerary.' };
    }
  
    // Fetch the event and join with the itinerary_img table
    const { data, error } = await supabase
      .from('event')
      .select(`
        id, location, type, description, time_start, time_end,
        event_img (img_url)
      `)
      .eq('id', eventId)
      .single();
  
    if (error) {
      console.error('Error fetching event:', error.message);
      return { error };
    }
  
    // Access the first img_url from the event_img or use the placeholder
    const img_url = data.event_img?.length ? data.event_img[0].img_url : 'https://via.placeholder.com/150';
    const adjustedData = { ...data, img_url };
  
    return { data: adjustedData };
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
