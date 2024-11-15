import { supabase } from './supabaseClient';

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