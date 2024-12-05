import { supabase } from './supabaseClient';

// Create a new event for a specific itinerary
export async function createEvent(itinerary_id, { location, description, day, time_start, time_end, img_url }) {
  // First create the event
  const { data, error } = await supabase.from('event').insert({
    itinerary_id,
    location,
    description,
    day,
    time_start,
    time_end
  }).select();

  if (error) {
    console.error('Error creating event:', error.message);
    return { data: null, error };
  }

  // If we have an image URL, save it
  if (img_url) {
    const { error: imgError } = await supabase
      .from('event_img')
      .insert({
        event_id: data[0].id,
        img_url
      });

    if (imgError) {
      console.error('Error saving event image:', imgError.message);
      return { data: null, error: imgError };
    }
  }

  return { data, error: null };
}

// Fetch events for a specific itinerary
export async function fetchItineraryEvents(itinerary_id) {
  try {
    if (!itinerary_id) {
      console.error('Itinerary ID is null or undefined');
      return { error: 'Itinerary ID is required to fetch events.' };
    }
  
    const { data, error } = await supabase
      .from('event')
      .select(`
          id, location, description, day, time_start, time_end,
          itinerary (name), 
          event_img (img_url)
      `)
      .eq('itinerary_id', itinerary_id);
  
    if (error) {
      console.error('Error fetching events:', error.message);
      return { error };
    }
  
    const flattenedData = data.map(event => {
      let img_url = 'https://via.placeholder.com/150';
      if (event.event_img) {
        img_url = event.event_img.img_url;
      }

      return {
        ...event,
        img_url,
        itinerary_name: event.itinerary?.name || 'Unnamed Itinerary'
      };
    });
  
    return { data: flattenedData };
  } catch (error) {
    console.error('Error fetching events:', error.message);
    return { error };
  }
}

// Fetch a single event by ID
export async function fetchEvent(eventId) {
  try {
    if (!eventId) {
      console.error('Event ID is null or undefined');
      return { error: 'Event ID is required to fetch the event.' };
    }
  
    // Fetch the event details
    const { data, error } = await supabase
      .from('event')
      .select(`
        id, location, description, day, time_start, time_end,
        event_img (img_url)
      `)
      .eq('id', eventId)
      .single();
  
    if (error) {
      console.error('Error fetching event:', error.message);
      return { error };
    }
  
    // Access the image URL from event_img or use a placeholder
    let img_url = 'https://via.placeholder.com/150';
    if (data.event_img) {
      img_url = data.event_img.img_url;
    }
  
    return { data: { ...data, img_url } };
  } catch (error) {
    console.error('Error fetching event:', error.message);
    return { error };
  }
}

// Save the image URL to the event_img table
export async function saveEventImage(eventId, imgUrl) {
  try {
    // Check if an image already exists for the event
    const { data: existingImage, error: fetchError } = await supabase
      .from('event_img')
      .select('id')
      .eq('event_id', eventId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error checking existing image:', fetchError.message);
      return { error: fetchError };
    }

    let result;
    if (existingImage) {
      console.log (`existingImage: ${JSON.stringify(existingImage)}`);
      // Update the existing image
      result = await supabase
        .from('event_img')
        .update({ img_url: imgUrl })
        .eq('id', existingImage.id);
    } else {
      console.log ('no existing image');
      // Insert a new image
      result = await supabase
        .from('event_img')
        .insert({
          event_id: eventId,
          img_url: imgUrl,
        });
    }

    const { data, error } = result;
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

// Delete an event and all its related data
export async function deleteEvent(eventId) {
  if (!eventId) {
    console.error('Event ID is null or undefined');
    return { error: 'Event ID is required to delete the event.' };
  }

  try {
    // Delete related records first (event_img, notes, todos, budgets)
    await supabase.from('event_img').delete().eq('event_id', eventId);
    await supabase.from('event_note').delete().eq('event_id', eventId);
    await supabase.from('event_todo').delete().eq('event_id', eventId);
    await supabase.from('event_budget').delete().eq('event_id', eventId);

    // Finally, delete the event itself
    const { data, error } = await supabase
      .from('event')
      .delete()
      .eq('id', eventId)
      .select();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error deleting event:', error.message);
    return { error };
  }
}
